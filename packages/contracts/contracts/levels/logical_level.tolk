// storage variables

global ctxPlayer: slice;
global ctxNonce: int;
global ctxLocked: bool;
global ctxPrevLogicalTime: int;
global ctxLogicalTimeDiff: int;

// loadData populates storage variables using stored data
fun loadData() {
    var ds = getContractData().beginParse();

    ctxPlayer = ds.loadAddress();
    ctxNonce = ds.loadUint(32);
    ctxLocked = ds.loadBool();
    ctxPrevLogicalTime = ds.loadUint(64);
    ctxLogicalTimeDiff = ds.loadUint(32);

    ds.assertEndOfSlice();
}

// saveData stores storage variables as a cell into persistent storage
fun saveData() {
    setContractData(
        beginCell()
            .storeSlice(ctxPlayer)
            .storeUint(ctxNonce, 32)
            .storeBool(ctxLocked)
            .storeUint(ctxPrevLogicalTime, 64)
            .storeUint(ctxLogicalTimeDiff, 32)
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

    inMsgBody.skipBits(32); // by convention, the first 32 bits of incoming message is the op

    // receive "check" message
    if (isSliceBitsEqual(inMsgBody, "check")) {
        // send CheckLevelResult msg
        val msgBody: cell = beginCell()
            .storeUint(0x6df37b4d, 32)
            .storeRef(beginCell().storeSlice("logical").endCell())
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

    if (getLogicalTime() - ctxPrevLogicalTime == ctxLogicalTimeDiff) {
        ctxLocked = false;
    }
    ctxPrevLogicalTime = getLogicalTime();
    saveData();
}

// get methods are a means to conveniently read contract data using, for example, HTTP APIs
// note that unlike in many other smart contract VMs, get methods cannot be called by other contracts

get locked(): bool {
    loadData();
    return ctxLocked;
}

get prevLogicalTime(): int {
    loadData();
    return ctxPrevLogicalTime;
}

get logicalTimeDiff(): int {
    loadData();
    return ctxLogicalTimeDiff;
}