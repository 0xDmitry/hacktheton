import "@stdlib/ownable";
import "@stdlib/deploy";
import "./messages";

message SwapTonToTokens {
    amount: Int as coins;
}

message RequestBalance {
    sender: Address;
}

message ResponseBalance {
    sender: Address;
    balance: Int as coins;
}

contract Token with Ownable, Deployable {
    owner: Address;
    nonce: Int;
    balance: Int as coins = 0;

    init(owner: Address, nonce: Int) {
        self.owner = owner;
        self.nonce = nonce;
    }

    receive(msg: SwapTonToTokens) {
        self.requireOwner();
        self.balance += msg.amount;
        send(SendParameters{
            to: sender(),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: "send ton".asComment()
        });
    }

    receive("swap tokens to ton") {
        self.requireOwner();
        self.balance = 0;
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    receive(msg: RequestBalance) {
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: ResponseBalance{
                sender: msg.sender,
                balance: self.balance
            }.toCell()
        });
    }

    get fun balance(): Int {
        return self.balance;
    }
}

contract SwapLevel with Deployable {
    player: Address;
    nonce: Int;
    token: Address;

    init(player: Address, nonce: Int) {
        self.player = player;
        self.nonce = nonce;

        let token_init: StateInit = initOf Token(myAddress(), nonce);
        self.token = contractAddress(token_init);
        send(SendParameters{
            to: self.token,
            value: ton("0.01"),
            bounce: false,
            data: token_init.data,
            code: token_init.code
        });
    }

    receive() {}

    receive("swap ton to tokens") {
        send(SendParameters{
            to: self.token,
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: SwapTonToTokens{
                amount: myBalance() - context().value
            }.toCell()
        });
    }

    receive("swap tokens to ton") {
        send(SendParameters{
            to: self.token,
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: "swap tokens to ton".asComment()
        });
    }

    receive("send ton") {
        require(sender() == self.token, "Wrong sender.");
        send(SendParameters{
            to: self.token,
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    receive("withdraw") {
        send(SendParameters{
            to: self.player,
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    receive("check") {
        send(SendParameters{
            to: self.token,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: RequestBalance{
                sender: sender()
            }.toCell()
        });
    }

    receive(msg: ResponseBalance) {
        require(sender() == self.token, "Wrong sender.");
        send(SendParameters{
            to: msg.sender,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: CheckLevelResult{
                name: "swap",
                completed: msg.balance >= ton("1000")
            }.toCell()
        });
    }
}