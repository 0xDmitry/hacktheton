import "@stdlib/ownable";
import "@stdlib/deploy";
import "./messages";

message Start {
    time: Int as uint32;
}

message Finish {
    time: Int as uint32;
}

contract Timer with Deployable {
    parent: Address;
    nonce: Int;
    startTime: Int? as uint32;

    init(parent: Address, nonce: Int) {
        self.parent = parent;
        self.nonce = nonce;
    }

    receive(msg: Start) {
        self.startTime = msg.time;
    }

    receive(msg: Finish) {
        if (self.startTime == null) {
            return;
        }

        require(msg.time - self.startTime!! < 180, "Too late.");
        self.startTime = null;
    }
}

contract BounceLevel with Ownable, Deployable {
    owner: Address;
    player: Address;
    nonce: Int;
    timer: Address;

    init(player: Address, nonce: Int) {
        self.owner = sender();
        self.player = player;
        self.nonce = nonce;

        let level_init: StateInit = initOf Timer(myAddress(), nonce);
        self.timer = contractAddress(level_init);
        send(SendParameters{
            to: self.timer,
            value: ton("0.01"),
            bounce: false,
            data: level_init.data,
            code: level_init.code
        });
    }

    receive("start") {
        send(SendParameters{
            to: self.timer,
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: Start{
                time: now()
            }.toCell()
        });
    }

    receive("finish") {
        send(SendParameters{
            to: self.timer,
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: Finish{
                time: now()
            }.toCell()
        });
    }

    bounced(_: Slice) {
        self.owner = self.player;
    }

    receive("check") {
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: CheckLevelResult{
                name: "bounce",
                completed: self.owner == self.player
            }.toCell()
        });
    }
}