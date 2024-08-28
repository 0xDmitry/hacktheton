import "@stdlib/deploy";

contract IntroductionLevel with Deployable {
    player: Address;
    nonce: Int;
    isCompleted: Bool = false;

    init(player: Address, nonce: Int) {
        self.player = player;
        self.nonce = nonce;
    }

    receive("complete") {
        self.isCompleted = true;
    }

    receive("check") {
        let ctx: Context = context();
        if (self.isCompleted) {
            send(SendParameters{
                to: ctx.sender,
                value: 0,
                mode: SendRemainingValue,
                bounce: false,
                body: "level completed".asComment()
            });
        }
    }

    get fun player(): Address {
        return self.player;
    }

    get fun nonce(): Int {
        return self.nonce;
    }

    get fun isCompleted(): Bool {
        return self.isCompleted;
    }
}