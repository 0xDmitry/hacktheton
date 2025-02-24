// storage variables

global ctxPlayer: slice;
global ctxNonce: int;
global ctxOwner: slice;
global ctxEnabled: bool;

// loadData populates storage variables using stored data
fun loadData() {
    var ds = getContractData().beginParse();

    ctxPlayer = ds.loadAddress();
    ctxNonce = ds.loadUint(32);
    ctxOwner = ds.loadAddress();
    ctxEnabled = ds.loadBool();

    ds.assertEndOfSlice();
}

// saveData stores storage variables as a cell into persistent storage
fun saveData() {
    setContractData(
        beginCell()
            .storeSlice(ctxPlayer)
            .storeUint(ctxNonce, 32)
            .storeSlice(ctxOwner)
            .storeBool(ctxEnabled)
        .endCell()
    );
}

// onInternalMessage is the main function of the contract and is called when it receives a message from other contracts
fun onInternalMessage(myBalance: int, msgValue: int, inMsgFull: cell, inMsgBody: slice) {
    if (inMsgBody.isEndOfSlice()) { // ignore all empty messages
        return;
    }

    var cs: slice = inMsgFull.beginParse();
    cs.skipBits(4);
    val senderAddress: slice = cs.loadAddress();

    loadData(); // here we populate the storage variables

    val op: int = inMsgBody.loadUint(32); // by convention, the first 32 bits of incoming message is the op

    // receive "check" message
    if (isSliceBitsEqual(inMsgBody, "check")) {
        // send CheckLevelResult msg
        val msgBody: cell = beginCell()
            .storeUint(0x6df37b4d, 32)
            .storeRef(beginCell().storeSlice("proxy").endCell())
            .storeBool(!ctxEnabled)
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
        assert(ctxEnabled, 501);
        val targetAddress: slice = inMsgBody.loadAddress();
        val msgBody: cell = inMsgBody.loadRef();
        val msg: builder = beginCell()
            .storeUint(0x18, 6)
            .storeSlice(targetAddress)
            .storeCoins(0)
            .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .storeRef(msgBody);
                    
        // send all the remaining value
        sendRawMessage(msg.endCell(), 64);
    } else {
        assert(isSliceBitsEqual(senderAddress, ctxOwner), 502);
        ctxEnabled = inMsgBody.loadBool();
        saveData();
    }
}

// get methods are a means to conveniently read contract data using, for example, HTTP APIs
// note that unlike in many other smart contract VMs, get methods cannot be called by other contracts

get owner(): slice {
    loadData();
    return ctxOwner;
}

get enabled(): bool {
    loadData();
    return ctxEnabled;
}