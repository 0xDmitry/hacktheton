import "@stdlib/ownable";
import "./messages";

struct Level {
    name: String;
    factory: Address;
    address: Address?;
    completed: Bool;
}

contract PlayerStats with Ownable {
    owner: Address;
    player: Address;
    levels: map<Int, Level>;

    init(owner: Address, player: Address) {
        self.owner = owner;
        self.player = player;
    }

    receive(msg: CreatePlayerLevel) {
        self.requireOwner();

        let level = Level{
            name: msg.name,
            factory: msg.factory,
            address: null,
            completed: false,
        };
        self.levels.set(sha256(msg.name), level);

        let ctx: Context = context();
        send(SendParameters{
            to: msg.factory,
            value: ctx.value - ton("0.02"),
            bounce: false,
            body: DeployLevel{
                player: self.player,
            }.toCell()
        });
    }

    receive(msg: LevelDeployed) {
        let level = self.levels.get(sha256(msg.name));
        if (level != null && level!!.factory == sender()) {
            self.levels.set(sha256(msg.name), Level{
                name: level!!.name,
                factory: level!!.factory,
                address: msg.address,
                completed: false,
            });
        }

        send(SendParameters{
            to: self.player,
            bounce: false,
            value: 0,
            mode: SendRemainingValue
        });
    }

    receive(msg: CheckLevel) {
        self.requireOwner();

        let level = self.levels.get(sha256(msg.name));
        if (level != null && level!!.address != null) {
            send(SendParameters{
                to: level!!.address!!,
                value: 0,
                mode: SendRemainingValue,
                bounce: false,
                body: "check".asComment()
            });
        }
    }

    receive(msg: CheckLevelResult) {
        let level = self.levels.get(sha256(msg.name));
        if (msg.completed && level != null && level!!.address != null && level!!.address!! == sender()) {
            self.levels.set(sha256(msg.name), Level{
                name: level!!.name,
                factory: level!!.factory,
                address: level!!.address,
                completed: true,
            });
        }

        send(SendParameters{
            to: self.player,
            bounce: false,
            value: 0,
            mode: SendRemainingValue
        });
    }

    receive("request stats") {
        let levelsCompleted: Int = 0;
        foreach (_, level in self.levels) {
            if (level.completed) {
                levelsCompleted += 1;
            }
        }

        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: ResponseStats{
                levelsCompleted: levelsCompleted
            }.toCell()
        });
    }

    get fun player(): Address {
        return self.player;
    }

    get fun levels(): map<Int, Level> {
        return self.levels;
    }
}