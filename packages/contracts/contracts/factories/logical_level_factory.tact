import "@stdlib/deploy";
import "../player_stats";
import "../messages";
const deploy_value: Int = ton("0.01");
const gas_consumption: Int = ton("0.015");

contract LogicalLevelFactory with Deployable {
  game_manager: Address;
  nonce: Int = 0;
  level_code: Cell;
  diff: Int = 0;
  init(game_manager: Address, level_code: Cell, diff: Int){
    self.game_manager = game_manager;
    self.level_code = level_code;
    self.diff = diff;
  }

  receive(msg: DeployLevel){
    let player_stats_init: StateInit = initOf PlayerStats(self.game_manager,
      msg.player
    );
    let player_stats_address: Address = contractAddress(player_stats_init);
    let ctx: Context = context();
    require(ctx.sender == player_stats_address, "Wrong sender");
    let level_init_data: Builder = beginCell();
    level_init_data = level_init_data.storeAddress(msg.player);
    level_init_data = level_init_data.storeUint(self.nonce, 32);
    level_init_data = level_init_data.storeInt(-1, 1);
    level_init_data = level_init_data.storeInt(0, 64);
    level_init_data = level_init_data.storeInt(self.diff, 32);
    let level_address: Address = contractAddress(StateInit{
        code: self.level_code,
        data: level_init_data.endCell()
      }
    );
    send(SendParameters{
        to: level_address,
        value: deploy_value,
        bounce: false,
        code: self.level_code,
        data: level_init_data.endCell()
      }
    );
    self.nonce += 1;
    send(SendParameters{
        to: ctx.sender,
        value: (ctx.value - deploy_value) - gas_consumption,
        bounce: false,
        body: LevelDeployed{name: "logical", address: level_address}.toCell()
      }
    );
  }
}