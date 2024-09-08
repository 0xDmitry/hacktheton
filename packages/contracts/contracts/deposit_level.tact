import "@stdlib/ownable";
import "@stdlib/deploy";
import "./messages";

contract DepositLevel with Ownable, Deployable {
    owner: Address;
    player: Address;
    nonce: Int;

    init(player: Address, nonce: Int) {
        self.owner = sender();
        self.player = player;
        self.nonce = nonce;
    }

    receive() {
        require(context().value >= ton("0.01"), "Not enough TON.");
        self.owner = sender();
    }

    receive("withdraw") {
        self.requireOwner();
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    receive("check") {
        let ctx: Context = context();
        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: CheckLevelResult{
                name: "deposit",
                completed: (myBalance() - ctx.value) == 0 && self.owner == self.player,
            }.toCell()
        });
    }

    get fun balance(): String {
        return myBalance().toCoinsString();
    }
}