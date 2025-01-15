import "@stdlib/deploy";
import "../messages";
message Flip {
  side: Bool;
}

contract Contract {
  nonce: Int;

  init(nonce: Int){
    self.nonce = nonce;
  }
}

contract CoinLevel with Deployable {
  player: Address;
  nonce: Int;
  consecutiveWins: Int = 0;
  flipsCount: Int = 0;

  init(player: Address, nonce: Int){
    self.player = player;
    self.nonce = nonce;
  }

  receive(msg: Flip){
    let init: StateInit = initOf Contract(self.flipsCount);
    let contractAddress: Address = contractAddress(init);
    let side = contractAddress.asSlice().asCell().hash() % 2 == 0;
    self.consecutiveWins = msg.side == side ? self.consecutiveWins + 1 : 0;
    self.flipsCount += 1;
  }

  receive("check"){
    send(SendParameters{
        to: sender(),
        value: 0,
        mode: SendRemainingValue,
        bounce: false,
        body: CheckLevelResult{
          name: "coin",
          completed: self.consecutiveWins >= 10
        }.toCell()
      }
    );
  }

  get fun consecutiveWins(): Int {
    return self.consecutiveWins;
  }

  get fun flipsCount(): Int {
    return self.flipsCount;
  }
}