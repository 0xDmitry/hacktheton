import "@stdlib/tvm-lowlevel"

// storage variables

global ctxPlayer: slice;
global ctxNonce: int;

// loadData populates storage variables using stored data
fun loadData() {
    var ds = getContractData().beginParse();

    ctxPlayer = ds.loadAddress();
    ctxNonce = ds.loadUint(32);

    ds.assertEndOfSlice();
}

// saveData stores storage variables as a cell into persistent storage
fun saveData() {
    setContractData(
        beginCell()
            .storeSlice(ctxPlayer)
            .storeUint(ctxNonce, 32)
        .endCell()
    );
}

// this asm actually do nothing on TVM level, but force compiler to think that 
// typeless continuation is actually () to int function
@pure
fun castToFunction(c: continuation): (() -> int)
    asm "NOP";

// put cell to c5 (we need it to clean register)
fun setC5(c: cell): void
    asm "c5 POPCTR";

// this asm gets function as an argument
// then it passes it to "wrapper" and execute wrapper with "1 1 CALLXARGS"
// that means move to wrapper stack 1 element and then return 1 element.
// wrapper itself try to execute function but catches exceptions, also it checks that
// after execution there is at least 1 element on stack via `DEPTH 2 THROWIFNOT`.
// if function didn't throw, wrapper returns it's result, otherwise it returns NULL from CATCH statement
@pure
fun tryExecute(guesser: (() -> int)): int
    asm "<{ TRY:<{ EXECUTE DEPTH 2 THROWIFNOT }>CATCH<{ 2DROP NULL }> }>CONT" "1 1 CALLXARGS";

// we do not trust function which we test: it may try to send messages or do other nasty things
// so we wrap it to the function which save register values prior to execution
// and restores them after
@inline
fun safeExecute(guesser: (() -> int)): int {
    val c4: cell = getContractData();
    val result: int = tryExecute(guesser);
    // restore c4 if guesser spoiled it
    setContractData(c4); 
    // clean actions if guesser spoiled them
    setC5(beginCell().endCell());
    return result;
}

// onInternalMessage is the main function of the contract and is called when it receives a message from other contracts
fun onInternalMessage(myBalance: int, msgValue: int, inMsgFull: cell, inMsgBody: slice) {
    if (inMsgBody.isEndOfSlice()) { // ignore all empty messages
        return;
    }

    var cs: slice = inMsgFull.beginParse();
    val flags: int = cs.loadUint(4);
    if (flags & 1) { // ignore all bounced messages
        return;
    }
    val senderAddress: slice = cs.loadAddress();

    loadData(); // here we populate the storage variables

    val op: int = inMsgBody.loadUint(32); // by convention, the first 32 bits of incoming message is the op

    // receive "check" message
    if (isSliceBitsEqual(inMsgBody, "check")) {
        // send CheckLevelResult msg
        val msgBody: cell = beginCell()
            .storeUint(0x6df37b4d, 32)
            .storeRef(beginCell().storeSlice("execution").endCell())
            .storeBool(myBalance - msgValue == 0)
        .endCell();
        val msg: builder = beginCell()
            .storeUint(0x18, 6)
            .storeSlice(senderAddress)
            .storeCoins(0)
            .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .storeRef(msgBody);
            
        // send all the remaining value
        sendRawMessage(msg.endCell(), 64);
        return;
    }

    if (op == 0) {
        val code: cell = inMsgBody.loadRef();
        val guesser = castToFunction(code.beginParse().transformSliceToContinuation());
        randomizeByLogicalTime();
        val randomNumber: int = random();
        val guess: int = safeExecute(guesser);
        assert(randomNumber == guess, 501);

        val msg = beginCell()
            .storeUint(0x18, 6)
            .storeSlice(senderAddress)
            .storeCoins(0)
            .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .endCell();

        // send all the contract balance
        sendRawMessage(msg, 128);
        return;
    }

    throw 0xffff; // if the message contains an op that is not known to this contract, we throw
}

get balance(): int {
    val [value, _] = getMyOriginalBalanceWithExtraCurrencies();
    return value;
}