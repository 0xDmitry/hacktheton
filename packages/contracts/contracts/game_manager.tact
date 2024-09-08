import "@stdlib/ownable";
import "@stdlib/deploy";
import "./player_stats";
import "./messages";

contract GameManager with Ownable, Deployable {
    owner: Address;
    levelFactories: map<Int, Address>;

    init(owner: Address) {
        self.owner = owner;
    }

    receive(msg: RegisterLevel) {
        self.requireOwner();
        self.levelFactories.set(sha256(msg.name), msg.factory);

        send(SendParameters{
            to: sender(),
            bounce: false,
            value: 0,
            mode: SendRemainingValue
        });
    }

    receive(msg: UnregisterLevel) {
        self.requireOwner();
        self.levelFactories.del(sha256(msg.name));

        send(SendParameters{
            to: sender(),
            bounce: false,
            value: 0,
            mode: SendRemainingValue
        });
    }

    receive(msg: CreateLevel) {
        let levelFactory = self.levelFactories.get(sha256(msg.name));
        require(levelFactory != null, "Unknown level");

        let player_stats_init: StateInit = initOf PlayerStats(myAddress(), sender());
        let player_stats_address: Address = contractAddress(player_stats_init);
        send(SendParameters{
            to: player_stats_address,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            data: player_stats_init.data,
            code: player_stats_init.code,
            body: CreatePlayerLevel{
                name: msg.name,
                factory: levelFactory!!
            }.toCell()
        });
    }

    receive(msg: CheckLevel) {
        let player_stats_init: StateInit = initOf PlayerStats(myAddress(), sender());
        let player_stats_address: Address = contractAddress(player_stats_init);
        send(SendParameters{
            to: player_stats_address,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: CheckLevel{
                name: msg.name,
            }.toCell()
        });
    }

    get fun levelFactories(): map<Int, Address> {
        return self.levelFactories;
    }
}