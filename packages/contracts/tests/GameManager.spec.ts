import { compile } from "@ton/blueprint"
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox"
import { Address, beginCell, toNano } from "@ton/core"
import { sha256_sync } from "@ton/crypto"
import { GameManager } from "../wrappers/GameManager"
import { IntroductionLevelFactory } from "../wrappers/IntroductionLevelFactory"
import { DepositLevelFactory } from "../wrappers/DepositLevelFactory"
import { ScannerLevelFactory } from "../wrappers/ScannerLevelFactory"
import { BounceLevelFactory } from "../wrappers/BounceLevelFactory"
import { IntruderLevelFactory } from "../wrappers/IntruderLevelFactory"
import { PartialLevelFactory } from "../wrappers/PartialLevelFactory"
import { PeekLevelFactory } from "../wrappers/PeekLevelFactory"
import { SwapLevelFactory } from "../wrappers/SwapLevelFactory"
import { CoinLevelFactory } from "../wrappers/CoinLevelFactory"
import { GatekeeperLevelFactory } from "../wrappers/GatekeeperLevelFactory"
import { BruteforceLevelFactory } from "../wrappers/BruteforceLevelFactory"
import { TolkLevelFactory } from "../wrappers/TolkLevelFactory"
import { UpgradeLevelFactory } from "../wrappers/UpgradeLevelFactory"
import { SeedLevelFactory } from "../wrappers/SeedLevelFactory"
import { LogicalLevelFactory } from "../wrappers/LogicalLevelFactory"
import { AccessLevelFactory } from "../wrappers/AccessLevelFactory"
import { TokenLevelFactory } from "../wrappers/TokenLevelFactory"
import { JackpotLevelFactory } from "../wrappers/JackpotLevelFactory"
import { ProxyLevelFactory } from "../wrappers/ProxyLevelFactory"
import { IntroductionLevel } from "../wrappers/IntroductionLevel"
import { DepositLevel } from "../wrappers/DepositLevel"
import { ScannerLevel } from "../wrappers/ScannerLevel"
import { Child as ScannerChild } from "../wrappers/ScannerChild"
import { BounceLevel } from "../wrappers/BounceLevel"
import { IntruderLevel } from "../wrappers/IntruderLevel"
import { Manager as IntruderManager } from "../wrappers/IntruderManager"
import { PartialLevel } from "../wrappers/PartialLevel"
import { PeekLevel } from "../wrappers/PeekLevel"
import { SwapLevel } from "../wrappers/SwapLevel"
import { CoinLevel } from "../wrappers/CoinLevel"
import { GatekeeperLevel } from "../wrappers/GatekeeperLevel"
import { BruteforceLevel } from "../wrappers/BruteforceLevel"
import { TolkLevel } from "../wrappers/TolkLevel"
import { UpgradeLevel } from "../wrappers/UpgradeLevel"
import { SeedLevel } from "../wrappers/SeedLevel"
import { LogicalLevel } from "../wrappers/LogicalLevel"
import { AccessLevel } from "../wrappers/AccessLevel"
import { TokenLevel } from "../wrappers/TokenLevel"
import { JackpotLevel } from "../wrappers/JackpotLevel"
import { ProxyLevel } from "../wrappers/ProxyLevel"
import { PlayerStats } from "../wrappers/PlayerStats"
import { LogicalSolution } from "../wrappers/LogicalSolution"
import "@ton/test-utils"

describe("GameManager", () => {
  let blockchain: Blockchain
  let owner: SandboxContract<TreasuryContract>
  let deployer: SandboxContract<TreasuryContract>
  let player: SandboxContract<TreasuryContract>
  let gameManager: SandboxContract<GameManager>

  beforeEach(async () => {
    blockchain = await Blockchain.create()

    owner = await blockchain.treasury("owner")
    gameManager = blockchain.openContract(
      await GameManager.fromInit(owner.address),
    )
    deployer = await blockchain.treasury("deployer")
    player = await blockchain.treasury("player")

    const deployResult = await gameManager.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: gameManager.address,
      deploy: true,
      success: true,
    })
  })

  it("check introduction level", async () => {
    const levelName = "introduction"
    const introductionLevelFactory = blockchain.openContract(
      await IntroductionLevelFactory.fromInit(gameManager.address),
    )

    const deployResult = await introductionLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: introductionLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: introductionLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: introductionLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await IntroductionLevel.fromInit(player.address, 0n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: introductionLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: introductionLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const authenticateResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Authenticate",
        password: "Tact and FunC for the win!",
      },
    )

    expect(authenticateResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check deposit level", async () => {
    const levelName = "deposit"
    const depositLevelFactory = blockchain.openContract(
      await DepositLevelFactory.fromInit(gameManager.address),
    )

    const deployResult = await depositLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: depositLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: depositLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: depositLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await DepositLevel.fromInit(player.address, 0n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: depositLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: depositLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const sendResult = await player.send({
      to: level.address,
      value: toNano("0.05"),
    })

    expect(sendResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    const withdrawResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      "withdraw",
    )

    expect(withdrawResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    expect(withdrawResult.transactions).toHaveTransaction({
      from: level.address,
      to: player.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check scanner level", async () => {
    const levelName = "scanner"
    const scannerLevelFactory = blockchain.openContract(
      await ScannerLevelFactory.fromInit(gameManager.address),
    )

    const deployResult = await scannerLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: scannerLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: scannerLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: scannerLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await ScannerLevel.fromInit(player.address, 0n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: scannerLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: scannerLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const scannerChild = await ScannerChild.fromInit(level.address, 0n)
    const sendChildAddressResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "SendChildAddress",
        address: scannerChild.address,
      },
    )

    expect(sendChildAddressResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check bounce level", async () => {
    const levelName = "bounce"
    const bounceLevelFactory = blockchain.openContract(
      await BounceLevelFactory.fromInit(gameManager.address),
    )

    const deployResult = await bounceLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: bounceLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: bounceLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: bounceLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await BounceLevel.fromInit(player.address, 0n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: bounceLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: bounceLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    blockchain.now = Math.floor(Date.now() / 1000)

    const startResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      "start",
    )

    expect(startResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    blockchain.now = Math.floor(Date.now() / 1000) + 185

    const finishResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      "finish",
    )

    expect(finishResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check intruder level", async () => {
    const levelName = "intruder"
    const intruderLevelFactory = blockchain.openContract(
      await IntruderLevelFactory.fromInit(gameManager.address),
    )

    const deployResult = await intruderLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: intruderLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: intruderLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: intruderLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await IntruderLevel.fromInit(player.address, 0n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: intruderLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: intruderLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const intruderManager = blockchain.openContract(
      await IntruderManager.fromInit(level.address, 0n),
    )
    const changeClientOwnerResult = await intruderManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "ChangeClientOwner",
        newOwner: player.address,
      },
    )

    expect(changeClientOwnerResult.transactions).toHaveTransaction({
      from: player.address,
      to: intruderManager.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check partial level", async () => {
    const levelName = "partial"
    const partialLevelFactory = blockchain.openContract(
      await PartialLevelFactory.fromInit(gameManager.address),
    )

    const deployResult = await partialLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: partialLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: partialLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: partialLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await PartialLevel.fromInit(player.address, 0n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: partialLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: partialLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const withdrawFromVaultResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.005"),
      },
      {
        $$type: "WithdrawFromVault",
        amount: 1000n,
      },
    )

    expect(withdrawFromVaultResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check peek level", async () => {
    const levelName = "peek"
    const peekLevelFactory = blockchain.openContract(
      await PeekLevelFactory.fromInit(gameManager.address, 1337n),
    )

    const deployResult = await peekLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: peekLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: peekLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: peekLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await PeekLevel.fromInit(player.address, 0n, 1337n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: peekLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: peekLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const unlockResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Unlock",
        password: 1337n,
      },
    )

    expect(unlockResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check swap level", async () => {
    const levelName = "swap"
    const swapLevelFactory = blockchain.openContract(
      await SwapLevelFactory.fromInit(gameManager.address),
    )

    const deployResult = await swapLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: swapLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: swapLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: swapLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await SwapLevel.fromInit(player.address, 0n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: swapLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: swapLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const sendTonResult = await level.send(
      player.getSender(),
      {
        value: toNano("1001"),
        bounce: false,
      },
      null,
    )

    expect(sendTonResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    const swapTonToTokensResult = await level.send(
      player.getSender(),
      {
        value: toNano("1001"),
      },
      "swap ton to tokens",
    )

    expect(swapTonToTokensResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check coin level", async () => {
    const levelName = "coin"
    const coinLevelFactory = blockchain.openContract(
      await CoinLevelFactory.fromInit(gameManager.address),
    )

    const deployResult = await coinLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: coinLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: coinLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: coinLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await CoinLevel.fromInit(player.address, 0n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: coinLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: coinLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    let flipResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Flip",
        side: false,
      },
    )

    expect(flipResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    flipResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Flip",
        side: false,
      },
    )

    expect(flipResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    flipResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Flip",
        side: false,
      },
    )

    expect(flipResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    flipResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Flip",
        side: false,
      },
    )

    expect(flipResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    flipResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Flip",
        side: true,
      },
    )

    expect(flipResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    flipResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Flip",
        side: true,
      },
    )

    expect(flipResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    flipResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Flip",
        side: false,
      },
    )

    expect(flipResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    flipResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Flip",
        side: true,
      },
    )

    expect(flipResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    flipResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Flip",
        side: false,
      },
    )

    expect(flipResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    flipResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Flip",
        side: false,
      },
    )

    expect(flipResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check gatekeeper level", async () => {
    const levelName = "gatekeeper"
    const gatekeeperLevelFactory = blockchain.openContract(
      await GatekeeperLevelFactory.fromInit(gameManager.address),
    )

    const deployResult = await gatekeeperLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: gatekeeperLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: gatekeeperLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: gatekeeperLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await GatekeeperLevel.fromInit(player.address, 0n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gatekeeperLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gatekeeperLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const unlockResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Unlock",
        a: 8989822887764667005644902914736932105128400472607769166540447545917080736621n,
        b: 3n,
      },
    )

    expect(unlockResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check bruteforce level", async () => {
    const levelName = "bruteforce"
    const bruteforceLevelFactory = blockchain.openContract(
      await BruteforceLevelFactory.fromInit(gameManager.address),
    )

    const deployResult = await bruteforceLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: bruteforceLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: bruteforceLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: bruteforceLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await BruteforceLevel.fromInit(player.address, 0n),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: bruteforceLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: bruteforceLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const unlockResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Unlock",
        a: 1200n,
        b: 850n,
        c: -1199n,
        d: -849n,
      },
    )

    expect(unlockResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check tolk level", async () => {
    const levelName = "tolk"
    const tolkLevelFactory = blockchain.openContract(
      await TolkLevelFactory.fromInit(
        gameManager.address,
        await compile("TolkLevel"),
      ),
    )

    const deployResult = await tolkLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: tolkLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: tolkLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: tolkLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await TolkLevel.createFromConfig(
        {
          player: player.address,
          nonce: 0n,
          locked: true,
        },
        await compile("TolkLevel"),
      ),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: tolkLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: tolkLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const unlockResult = await level.send(
      player.getSender(),
      beginCell().storeUint(0xf0fd50bb, 32).endCell(),
      toNano("0.05"),
    )

    expect(unlockResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check upgrade level", async () => {
    const levelName = "upgrade"
    const upgradeLevelFactory = blockchain.openContract(
      await UpgradeLevelFactory.fromInit(
        gameManager.address,
        await compile("UpgradeLevel"),
      ),
    )

    const deployResult = await upgradeLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: upgradeLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: upgradeLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: upgradeLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await UpgradeLevel.createFromConfig(
        {
          player: player.address,
          nonce: 0n,
          locked: true,
        },
        await compile("UpgradeLevel"),
      ),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: upgradeLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: upgradeLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const upgradeResult = await level.send(
      player.getSender(),
      beginCell()
        .storeUint(0xdbfaf817, 32)
        .storeRef(await compile("UpgradeSolution"))
        .endCell(),
      toNano("0.05"),
    )

    expect(upgradeResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    const unlockResult = await level.send(
      player.getSender(),
      beginCell().storeUint(0xf0fd50bb, 32).endCell(),
      toNano("0.05"),
    )

    expect(unlockResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check seed level", async () => {
    const levelName = "seed"
    const seedLevelFactory = blockchain.openContract(
      await SeedLevelFactory.fromInit(
        gameManager.address,
        await compile("SeedLevel"),
      ),
    )

    const deployResult = await seedLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: seedLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: seedLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: seedLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await SeedLevel.createFromConfig(
        {
          player: player.address,
          nonce: 0n,
          locked: true,
          seed: 0n,
        },
        await compile("SeedLevel"),
      ),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: seedLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: seedLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const unlockResult = await level.send(
      player.getSender(),
      beginCell()
        .storeUint(0xf0fd50bb, 32)
        .storeUint(
          22829022310657218837805938557735217176684715703013430939186469045610179822111n,
          256,
        )
        .endCell(),
      toNano("0.05"),
    )

    expect(unlockResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check logical level", async () => {
    const levelName = "logical"
    const logicalLevelFactory = blockchain.openContract(
      await LogicalLevelFactory.fromInit(
        gameManager.address,
        await compile("LogicalLevel"),
        1000000n,
      ),
    )

    const deployResult = await logicalLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: logicalLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: logicalLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: logicalLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await LogicalLevel.createFromConfig(
        {
          player: player.address,
          nonce: 0n,
          locked: true,
          prevLogicalTime: 0n,
          logicalTimeDiff: 1000000n,
        },
        await compile("LogicalLevel"),
      ),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: logicalLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: logicalLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const logicalSolution = blockchain.openContract(
      await LogicalSolution.createFromConfig(
        {},
        await compile("LogicalSolution"),
      ),
    )

    const deploySolutionResult = await logicalSolution.sendDeploy(
      deployer.getSender(),
      toNano("0.05"),
    )

    expect(deploySolutionResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: logicalSolution.address,
      deploy: true,
      success: true,
    })

    const solveResult = await logicalSolution.send(
      player.getSender(),
      beginCell().storeAddress(level.address).endCell(),
      toNano("0.05"),
    )

    expect(solveResult.transactions).toHaveTransaction({
      from: logicalSolution.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check access level", async () => {
    const levelName = "access"
    const accessLevelFactory = blockchain.openContract(
      await AccessLevelFactory.fromInit(
        gameManager.address,
        await compile("AccessLevel"),
      ),
    )

    const deployResult = await accessLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: accessLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: accessLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: accessLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await AccessLevel.createFromConfig(
        {
          player: player.address,
          nonce: 0n,
          owner: accessLevelFactory.address,
          locked: true,
        },
        await compile("AccessLevel"),
      ),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: accessLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: accessLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const changeNonceResult = await level.send(
      player.getSender(),
      beginCell().storeUint(0x8caa87bd, 32).storeUint(9999, 32).endCell(),
      toNano("0.05"),
    )

    expect(changeNonceResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    const changeOwnerResult = await level.send(
      player.getSender(),
      beginCell()
        .storeUint(0xf1eef33c, 32)
        .storeAddress(player.address)
        .endCell(),
      toNano("0.05"),
    )

    expect(changeOwnerResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    const unlockResult = await level.send(
      player.getSender(),
      beginCell().storeUint(0xf0fd50bb, 32).endCell(),
      toNano("0.05"),
    )

    expect(unlockResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check token level", async () => {
    const levelName = "token"
    const tokenLevelFactory = blockchain.openContract(
      await TokenLevelFactory.fromInit(
        gameManager.address,
        await compile("TokenLevel"),
      ),
    )

    const deployResult = await tokenLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: tokenLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: tokenLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: tokenLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await TokenLevel.createFromConfig(
        {
          player: player.address,
          nonce: 0n,
          owner: tokenLevelFactory.address,
          totalSupply: 0n,
        },
        await compile("TokenLevel"),
      ),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: tokenLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: tokenLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const transferResult = await level.send(
      player.getSender(),
      beginCell()
        .storeUint(0x3ee943f1, 32)
        .storeAddress(level.address)
        .storeInt(-1000000, 256)
        .endCell(),
      toNano("0.05"),
    )

    expect(transferResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check jackpot level", async () => {
    const levelName = "jackpot"
    const jackpotLevelFactory = blockchain.openContract(
      await JackpotLevelFactory.fromInit(
        gameManager.address,
        await compile("JackpotLevel"),
      ),
    )

    const deployResult = await jackpotLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: jackpotLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: jackpotLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: jackpotLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await JackpotLevel.createFromConfig(
        {
          player: player.address,
          nonce: 0n,
        },
        await compile("JackpotLevel"),
      ),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: jackpotLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: jackpotLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const depositResult = await level.send(
      player.getSender(),
      beginCell().storeUint(0, 32).endCell(),
      toNano("1"),
    )

    expect(depositResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    let withdrawResult = await level.send(
      player.getSender(),
      beginCell().storeUint(1, 32).storeCoins(990000000n).endCell(),
      toNano("0.05"),
    )

    expect(withdrawResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    withdrawResult = await level.send(
      player.getSender(),
      beginCell()
        .storeUint(1, 32)
        .storeCoins(await level.getBalance())
        .endCell(),
      toNano("0.05"),
    )

    expect(withdrawResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })

  it("check proxy level", async () => {
    const levelName = "proxy"
    const proxyLevelFactory = blockchain.openContract(
      await ProxyLevelFactory.fromInit(
        gameManager.address,
        await compile("ProxyLevel"),
      ),
    )

    const deployResult = await proxyLevelFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: proxyLevelFactory.address,
      deploy: true,
      success: true,
    })

    const registerResult = await gameManager.send(
      owner.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "RegisterLevel",
        name: levelName,
        factory: proxyLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    expect(registerResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: owner.address,
      success: true,
    })

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "CreateLevel",
        name: levelName,
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    const playerStats = blockchain.openContract(
      await PlayerStats.fromInit(gameManager.address, player.address),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: proxyLevelFactory.address,
      success: true,
    })

    const level = blockchain.openContract(
      await ProxyLevel.createFromConfig(
        {
          player: player.address,
          nonce: 0n,
          owner: Address.parse(
            "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
          ),
          enabled: true,
        },
        await compile("ProxyLevel"),
      ),
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: proxyLevelFactory.address,
      to: level.address,
      deploy: true,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: proxyLevelFactory.address,
      to: playerStats.address,
      success: true,
    })

    expect(createLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    let levels = await playerStats.getLevels()
    let key = sha256_sync(levelName)
    let isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(false)

    // Solve level

    const disableResult = await level.send(
      player.getSender(),
      beginCell()
        .storeUint(0, 32)
        .storeAddress(
          Address.parse("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"),
        )
        .storeRef(beginCell().storeInt(0n, 1).endCell())
        .endCell(),
      toNano("0.05"),
    )

    expect(disableResult.transactions).toHaveTransaction({
      from: player.address,
      to: level.address,
      success: true,
    })

    checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: levelName,
      },
    )

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: gameManager.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: level.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: level.address,
      to: playerStats.address,
      success: true,
    })

    expect(checkLevelResult.transactions).toHaveTransaction({
      from: playerStats.address,
      to: player.address,
      success: true,
    })

    levels = await playerStats.getLevels()
    key = sha256_sync(levelName)
    isLevelCompleted = levels?.get(
      BigInt("0x" + key.toString("hex")),
    )?.completed
    expect(isLevelCompleted).toEqual(true)
  })
})
