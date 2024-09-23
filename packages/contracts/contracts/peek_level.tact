import "@stdlib/deploy";
import "./messages";

message Unlock {
    password: Int as uint32;
}

contract PeekLevel with Deployable {
    player: Address;
    nonce: Int;
    password: Int as uint32;
    locked: Bool = true;

    init(player: Address, nonce: Int, password: Int) {
        self.player = player;
        self.nonce = nonce;
        self.password = password;
    }

    receive(msg: Unlock) {
        require(msg.password == self.password, "Wrong password.");
        self.locked = false;
    }

    receive("check") {
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: CheckLevelResult{
                name: "peek",
                completed: self.locked == false
            }.toCell()
        });
    }

    get fun locked(): Bool {
        return self.locked;
    }
}