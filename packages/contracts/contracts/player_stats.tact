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

        send(SendParameters{
            to: msg.factory,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: DeployLevel{
                player: self.player,
            }.toCell()
        });
    }

    receive(msg: LevelDeployed) {
        let ctx: Context = context();
        // Send level name in msg
        foreach (key, level in self.levels) {
            if (level.factory == ctx.sender) {
                self.levels.set(key, Level{
                    name: level.name,
                    factory: level.factory,
                    address: msg.address,
                    completed: false,
                });
            }
        }
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

    receive("level completed") {
        let ctx: Context = context();
        foreach (key, level in self.levels) {
            if (level.address != null && level.address!! == ctx.sender) {
                self.levels.set(key, Level{
                    name: level.name,
                    factory: level.factory,
                    address: level.address,
                    completed: true,
                });

                send(SendParameters{
                    to: self.owner,
                    value: 0,
                    mode: SendRemainingValue,
                    bounce: false,
                    body: PlayerLevelCompleted {
                        player: self.player,
                        name: level.name
                    }.toCell()
                });
            }
        }
    }

    get fun player(): Address {
        return self.player;
    }

    get fun levels(): map<Int, Level> {
        return self.levels;
    }
}