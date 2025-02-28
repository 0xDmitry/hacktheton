import "@stdlib/deploy";
import "./player_stats";
import "./messages";

struct Player {
  address: Address;
  name: String;
  levelsCompleted: Int;
  order: Int;
}

contract Leaderboard with Deployable {
  gameManager: Address;
  players: map<Address, Player>;
  order: Int = 0;

  init(gameManager: Address) {
    self.gameManager = gameManager;
    self.players = emptyMap();
  }

  receive(msg: AddPlayer){
    let playerStatsInit = initOf PlayerStats(self.gameManager, sender());
    let playerStats = contractAddress(playerStatsInit);
    self.players.set(playerStats, Player{address: sender(), name: msg.name, levelsCompleted: 0, order: self.order});
    self.order += 1;

    send(SendParameters{
        to: playerStats,
        bounce: true,
        value: 0,
        mode: SendRemainingValue,
        body: "request stats".asComment()
      }
    );
  }

  receive(msg: UpdatePlayer){
    let playerStatsInit = initOf PlayerStats(self.gameManager, sender());
    let playerStats = contractAddress(playerStatsInit);
    let player = self.players.get(playerStats);
    require(player != null, "Player doesn't exist");
    require(player!!.address == sender(), "Wrong sender");
    self.players.set(playerStats, Player{address: player!!.address, name: msg.name, levelsCompleted: player!!.levelsCompleted, order: player!!.order});

    send(SendParameters{
        to: playerStats,
        bounce: true,
        value: 0,
        mode: SendRemainingValue,
        body: "request stats".asComment()
      }
    );
  }

  receive(msg: ResponseStats){
    let player = self.players.get(sender());
    require(player != null, "Wrong sender");
    self.players.set(sender(), Player{address: player!!.address, name: player!!.name, levelsCompleted: msg.levelsCompleted, order: player!!.order});

    send(SendParameters{
        to: player!!.address,
        bounce: false,
        value: 0,
        mode: SendRemainingValue
      }
    );
  }

  get fun players(): map<Address, Player> {
    return self.players;
  }
}