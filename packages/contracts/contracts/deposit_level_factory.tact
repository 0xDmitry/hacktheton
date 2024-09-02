import "@stdlib/deploy";
import "./deposit_level";
import "./player_stats";
import "./messages";

contract DepositLevelFactory with Deployable {
    game_manager: Address;
    nonce: Int = 0;

    init(game_manager: Address) {
        self.game_manager = game_manager;
    }

    receive(msg: DeployLevel) {
        let player_stats_init: StateInit = initOf PlayerStats(self.game_manager, msg.player);
        let player_stats_address: Address = contractAddress(player_stats_init);
        let ctx: Context = context();
        require(ctx.sender == player_stats_address, "Wrong sender");

        let level_init: StateInit = initOf DepositLevel(msg.player, self.nonce);
        let level_address: Address = contractAddress(level_init);
        send(SendParameters{
            to: level_address,
            value: ton("0.01"),
            bounce: false,
            data: level_init.data,
            code: level_init.code,
            body: Deploy {
                queryId: 0,
            }.toCell()
        });

        self.nonce += 1;
        
        send(SendParameters{
            to: ctx.sender,
            value: ton("0.01"),
            bounce: false,
            body: LevelDeployed{
                address: level_address,
            }.toCell()
        });
    }
}