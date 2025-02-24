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

    val target: slice = inMsgBody.loadAddress();
    val msgBody: cell = beginCell()
        .storeUint(0, 32)
    .endCell();
    val msg: cell = beginCell()
        .storeUint(0x18, 6)
        .storeSlice(target)
        .storeCoins(10000000)
        .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .storeRef(msgBody)
    .endCell();
            
    sendRawMessage(msg, 0);
    sendRawMessage(msg, 0);
}