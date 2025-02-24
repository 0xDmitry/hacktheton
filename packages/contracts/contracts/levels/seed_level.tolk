const OP_UNLOCK = "op::unlock"c; // create an opcode from string using the "c" prefix, this results in 0xf0fd50bb opcode in this case

// storage variables

global ctxPlayer: slice;
global ctxNonce: int;
global ctxLocked: bool;
global ctxSeed: int;

// loadData populates storage variables using stored data
fun loadData() {
    var ds = getContractData().beginParse();

    ctxPlayer = ds.loadAddress();
    ctxNonce = ds.loadUint(32);
    ctxLocked = ds.loadBool();
    ctxSeed = ds.loadUint(256);

    ds.assertEndOfSlice();
}

// saveData stores storage variables as a cell into persistent storage
fun saveData() {
    setContractData(
        beginCell()
            .storeSlice(ctxPlayer)
            .storeUint(ctxNonce, 32)
            .storeBool(ctxLocked)
            .storeUint(ctxSeed, 256)
        .endCell()
    );
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
            .storeRef(beginCell().storeSlice("seed").endCell())
            .storeBool(!ctxLocked)
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

    if (op == OP_UNLOCK) {
        val guess: int = inMsgBody.loadUint(256);
        if (ctxSeed == 0) {
            ctxSeed = random();
        }
        randomSetSeed(ctxSeed);
        ctxSeed = random();
        if (guess == ctxSeed) {
            ctxLocked = false;
        }
        saveData();
        return;
    }

    throw 0xffff; // if the message contains an op that is not known to this contract, we throw
}

// get methods are a means to conveniently read contract data using, for example, HTTP APIs
// note that unlike in many other smart contract VMs, get methods cannot be called by other contracts

get locked(): bool {
    loadData();
    return ctxLocked;
}

get seed(): int {
    loadData();
    return ctxSeed;
}