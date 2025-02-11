import "@stdlib/tvm-dicts"

const OP_MINT = "op::mint"c; // create an opcode from string using the "c" prefix, this results in 0xecad15c4 opcode in this case
const OP_TRANSFER = "op::transfer"c; // create an opcode from string using the "c" prefix, this results in 0x3ee943f1 opcode in this case

// storage variables

global ctxPlayer: slice;
global ctxNonce: int;
global ctxOwner: slice;
global ctxBalances: cell;
global ctxTotalSupply: int;

// loadData populates storage variables using stored data
fun loadData() {
    var ds = getContractData().beginParse();

    ctxPlayer = ds.loadAddress();
    ctxNonce = ds.loadUint(32);
    ctxOwner = ds.loadAddress();
    ctxBalances = ds.loadDict();
    ctxTotalSupply = ds.loadUint(256);

    ds.assertEndOfSlice();
}

// saveData stores storage variables as a cell into persistent storage
fun saveData() {
    setContractData(
        beginCell()
            .storeSlice(ctxPlayer)
            .storeUint(ctxNonce, 32)
            .storeSlice(ctxOwner)
            .storeDict(ctxBalances)
            .storeUint(ctxTotalSupply, 256)
        .endCell()
    );
}

fun getBalance(balances: cell, account: slice): int {
    var (_, value: slice, _, isFound: bool) = balances.prefixDictGet(account.getRemainingBitsCount(), account);
    if (!isFound) {
        return 0;
    }
    return value.loadUint(256);
}

fun setBalance(mutate self: cell, account: slice, amount: int): void {
    // will throw if amount is negative
    var isSuccess: bool = self.prefixDictSet(account.getRemainingBitsCount(), account, beginCell().storeUint(amount, 256).endCell().beginParse());
    assert(isSuccess, 501);
}

fun mint(balances: cell, to: slice, amount: int): cell {
    var toBalance: int = getBalance(balances, to);

    toBalance += amount;
  
    balances.setBalance(to, toBalance);
    return balances;
}

fun transfer(balances: cell, from: slice, to: slice, amount: int): cell {
    var fromBalance: int = getBalance(balances, from);
    var toBalance: int = getBalance(balances, to);
  
    fromBalance -= amount;
    toBalance += amount;

    assert(fromBalance > 0, 502);
  
    balances.setBalance(from, fromBalance);
    balances.setBalance(to, toBalance);
    return balances;
}

// onInternalMessage is the main function of the contract and is called when it receives a message from other contracts
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
            .storeRef(beginCell().storeSlice("token").endCell())
            .storeBool(getBalance(ctxBalances, ctxPlayer) == ctxTotalSupply)
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

    if (op == OP_MINT) {
        assert(isSliceBitsEqual(senderAddress, ctxOwner), 503);
        var to: slice = inMsgBody.loadAddress();
        var amount: int = inMsgBody.loadInt(256);
        ctxTotalSupply += amount;
        ctxBalances = mint(ctxBalances, to, amount);
        saveData();
        return;
    }

    if (op == OP_TRANSFER) {
        var to: slice = inMsgBody.loadAddress();
        var amount: int = inMsgBody.loadInt(256);
        ctxBalances = transfer(ctxBalances, senderAddress, to, amount);
        saveData();
        return;
    }

    throw 0xffff; // if the message contains an op that is not known to this contract, we throw
}

// get methods are a means to conveniently read contract data using, for example, HTTP APIs
// note that unlike in many other smart contract VMs, get methods cannot be called by other contracts

get owner(): slice {
    loadData();
    return ctxOwner;
}

get balanceOf(account: slice): int {
    loadData();
    return getBalance(ctxBalances, account);
}

get totalSupply(): int {
    loadData();
    return ctxTotalSupply;
}