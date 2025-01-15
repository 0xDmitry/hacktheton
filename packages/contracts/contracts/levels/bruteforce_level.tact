import "@stdlib/deploy";
import "../messages";
message Unlock {
  a: Int;
  b: Int;
  c: Int;
  d: Int;
}

contract BruteforceLevel with Deployable {
  player: Address;
  nonce: Int;
  locked: Bool = true;
  x: Int as uint8 = 0;
  y: Int as uint8 = 0;
  init(player: Address, nonce: Int){
    self.player = player;
    self.nonce = nonce;
  }

  receive(msg: Unlock){
    self.x = msg.a + msg.c;
    self.y = msg.b + msg.d;
    require((self.x + self.y) == 2, "First check failed.");
    require((((pow(msg.a, 25) +
        pow(msg.b, 25)) +
        pow(msg.c, 25)) +
        pow(msg.d, 25)) ==
        1968172103452999492963878188028555943794336458502883276710491621054698698752,
      "Second check failed."
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
          name: "bruteforce",
          completed: !self.locked
        }.toCell()
      }
    );
  }

  get fun locked(): Bool {
    return self.locked;
  }
}