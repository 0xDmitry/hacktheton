import "@stdlib/deploy";
import "../messages";
message Unlock {
  a: Int;
  b: Int;
}

contract GatekeeperLevel with Deployable {
  player: Address;
  nonce: Int;
  locked: Bool = true;
  init(player: Address, nonce: Int){
    self.player = player;
    self.nonce = nonce;
  }

  receive(msg: Unlock){
    require((sender().asSlice().asCell().hash() ^ ((msg.a << 2) + msg.b)) ==
        myAddress().asSlice().asCell().hash(),
      "Check failed."
    );
    self.locked = false;
  }

  receive("check"){
    send(SendParameters{
        to: sender(),
        value: 0,
        mode: SendRemainingValue,
        bounce: false,
        body: CheckLevelResult{
          name: "gatekeeper",
          completed: !self.locked
        }.toCell()
      }
    );
  }

  get fun locked(): Bool {
    return self.locked;
  }
}