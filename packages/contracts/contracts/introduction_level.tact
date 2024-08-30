import "@stdlib/deploy";

message Authenticate {
    password: String;
}

contract IntroductionLevel with Deployable {
    player: Address;
    nonce: Int;
    password: String = "Tact and FunC for the win!";
    isCompleted: Bool = false;

    init(player: Address, nonce: Int) {
        self.player = player;
        self.nonce = nonce;
    }

    receive(msg: Authenticate) {
        require(msg.password == self.password, "Wrong password.");
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

    get fun password(): String {
        return self.password;
    }

    get fun isCompleted(): Bool {
        return self.isCompleted;
    }

    get fun info(): String {
        return "You will find what you need in getInfo1().";
    }

    get fun info1(): String {
        return "Try getInfo2(), but with 'hello' as a parameter.";
    }

    get fun info2(param: String): String {
        require(param == "hello", "Wrong parameter.");
        return "Try getInfoNum() to know the number of the next info method to call.";
    }

    get fun infoNum(): Int {
        return 42;
    }

    get fun info42(): String {
        return "Send message Authenticate if you know the password.";
    }
}