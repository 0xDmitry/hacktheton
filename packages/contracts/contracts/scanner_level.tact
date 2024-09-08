import "@stdlib/ownable";
import "@stdlib/deploy";
import "./messages";

contract Child with Deployable {
    parent: Address;
    nonce: Int;

    init(parent: Address, nonce: Int) {
        self.parent = parent;
        self.nonce = nonce;
    }
}

message SendChildAddress {
    address: Address;
}

contract ScannerLevel with Ownable, Deployable {
    owner: Address;
    player: Address;
    nonce: Int;
    child: Address;

    init(player: Address, nonce: Int) {
        self.owner = sender();
        self.player = player;
        self.nonce = nonce;

        let level_init: StateInit = initOf Child(myAddress(), nonce);
        self.child = contractAddress(level_init);
        send(SendParameters{
            to: self.child,
            value: ton("0.001"),
            mode: SendPayGasSeparately,
            bounce: false,
            data: level_init.data,
            code: level_init.code,
            body: Deploy {
                queryId: 0,
            }.toCell()
        });
    }

    receive(msg: SendChildAddress) {
        require(msg.address == self.child, "Wrong child address.");
        self.owner = sender();
    }

    receive("check") {
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: CheckLevelResult{
                name: "scanner",
                completed: self.owner == self.player
            }.toCell()
        });
    }
}
