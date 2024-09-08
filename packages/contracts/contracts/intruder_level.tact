import "@stdlib/deploy";
import "./messages";

message(0x6e38a063) ChangeLevelOwner {
    newOwner: Address;
}

message(0x6f13c225) ChangeClientOwner {
    newOwner: Address;
}

message(0xa4e501ef) ChangeOwnerInternal {
    newOwner: Address;
}

contract Manager with Deployable {
    client: Address;
    nonce: Int;

    init(client: Address, nonce: Int) {
        self.client = client;
        self.nonce = nonce;
    }

    receive(msg: ChangeClientOwner) {
        send(SendParameters{
            to: self.client,
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: ChangeOwnerInternal{
                newOwner: msg.newOwner
            }.toCell()
        });
    }
}

contract IntruderLevel with Deployable {
    owner: Address;
    player: Address;
    nonce: Int;
    manager: Address;

    init(player: Address, nonce: Int) {
        self.owner = sender();
        self.player = player;
        self.nonce = nonce;

        let level_init: StateInit = initOf Manager(myAddress(), nonce);
        self.manager = contractAddress(level_init);
        send(SendParameters{
            to: self.manager,
            value: ton("0.01"),
            bounce: false,
            data: level_init.data,
            code: level_init.code
        });
    }

    receive(msg: ChangeLevelOwner) {
        require(sender() == self.owner, "Wrong sender.");
        send(SendParameters{
            to: self.manager,
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: ChangeClientOwner{
                newOwner: msg.newOwner
            }.toCell()
        });
    }

    receive(msg: ChangeOwnerInternal) {
        require(sender() == self.manager, "Wrong sender.");
        self.owner = msg.newOwner;
    }

    receive("check") {
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: CheckLevelResult{
                name: "intruder",
                completed: self.owner == self.player
            }.toCell()
        });
    }

    get fun owner(): Address {
        return self.owner;
    }
}
