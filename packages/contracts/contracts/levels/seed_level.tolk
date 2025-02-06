const OP_UNLOCK = "op::unlock"c; // create an opcode from string using the "c" prefix, this results in 0xf0fd50bb opcode in this case

// storage variables

global ctx_player: slice;
global ctx_nonce: int;
global ctx_locked: bool;
global ctx_seed: int;

// loadData populates storage variables using stored data
fun loadData() {
    var ds = getContractData().beginParse();

    ctx_player = ds.loadAddress();
    ctx_nonce = ds.loadUint(32);
    ctx_locked = ds.loadBool();
    ctx_seed = ds.loadUint(256);

    ds.assertEndOfSlice();
}

// saveData stores storage variables as a cell into persistent storage
fun saveData() {
    setContractData(
        beginCell()
            .storeSlice(ctx_player)
            .storeUint(ctx_nonce, 32)
            .storeBool(ctx_locked)
            .storeUint(ctx_seed, 256)
        .endCell()
    );
}

// recv_internal is the main function of the contract and is called when it receives a message from other contracts
fun onInternalMessage(myBalance: int, msgValue: int, inMsgFull: cell, inMsgBody: slice) {
    if (inMsgBody.isEndOfSlice()) { // ignore all empty messages
        return;
    }

    var cs: slice = inMsgFull.beginParse();
    var flags: int = cs.loadUint(4);
    if (flags & 1) { // ignore all bounced messages
        return;
    }
    var senderAddress: slice = cs.loadAddress();

    loadData(); // here we populate the storage variables

    // receive "check" message
    if (sliceHash(inMsgBody) == 0xb92ab1b3504a092e6e10b90beb85a7ceb990452ba73c09375bf2dd2a56cbcf7f) {
        // send CheckLevelResult msg
        var msgBody: cell = beginCell()
            .storeUint(0x6df37b4d, 32)
            .storeRef(beginCell().storeSlice("seed").endCell())
            .storeBool(!ctx_locked)
        .endCell();
        var msg: builder = beginCell()
            .storeUint(0x18, 6)
            .storeSlice(senderAddress)
            .storeCoins(0)
            .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .storeRef(msgBody);
            
        // send all the remaining value
        sendRawMessage(msg.endCell(), 64);
        return;
    }

    var op: int = inMsgBody.loadUint(32); // by convention, the first 32 bits of incoming message is the op

    if (op == OP_UNLOCK) {
        var guess: int = inMsgBody.loadUint(256);
        if (ctx_seed == 0) {
            ctx_seed = random();
        }
        randomSetSeed(ctx_seed);
        ctx_seed = random();
        if (guess == ctx_seed) {
            ctx_locked = false;
        }
        saveData();
        return;
    }

    throw 0xffff; // if the message contains an op that is not known to this contract, we throw
}

// get methods are a means to conveniently read contract data using, for example, HTTP APIs
// they are marked with method_id
// note that unlike in many other smart contract VMs, get methods cannot be called by other contracts

get get_locked(): bool {
    loadData();
    return ctx_locked;
}

get get_seed(): int {
    loadData();
    return ctx_seed;
}