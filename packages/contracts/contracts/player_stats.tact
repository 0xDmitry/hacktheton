import "@stdlib/ownable";
import "./messages";

struct Level {
    name: String;
    address: Address?;
    completed: Bool;
}

contract PlayerStats with Ownable {
    owner: Address;
    player: Address;
    levels: map<Address, Level>;

    init(owner: Address, player: Address) {
        self.owner = owner;
        self.player = player;
    }

    receive(msg: CreatePlayerLevel) {
        self.requireOwner();

        let level = self.levels.get(msg.factory);
        if (level == null) {
            level = Level{
                name: msg.name,
                address: null,
                completed: false,
            };
            self.levels.set(msg.factory, level);
        }

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
        foreach (factory, level in self.levels) {
            if (factory == ctx.sender) {
                self.levels.set(factory, Level{
                    name: level.name,
                    address: msg.address,
                    completed: false,
                });
            }
        }
    }

    receive(msg: CheckLevel) {
        self.requireOwner();

        foreach (_, level in self.levels) {
            if (level.name == msg.name && level.address != null) {
                send(SendParameters{
                    to: level.address!!,
                    value: 0,
                    mode: SendRemainingValue,
                    bounce: false,
                    body: "check".asComment()
                });
            }
        }
    }

    receive("level completed") {
        let ctx: Context = context();
        foreach (factory, level in self.levels) {
            if (level.address != null && level.address!! == ctx.sender) {
                self.levels.set(factory, Level{
                    name: level.name,
                    address: level.address,
                    completed: true,
                });
            }
        }
    }

    get fun player(): Address {
        return self.player;
    }

    get fun levels(): map<Address, Level> {
        return self.levels;
    }
}