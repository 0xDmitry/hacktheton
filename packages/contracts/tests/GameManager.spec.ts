import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox"
import { toNano } from "@ton/core"
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
import { PlayerStats } from "../wrappers/PlayerStats"
import "@ton/test-utils"

describe("GameManager", () => {
  let blockchain: Blockchain
  let owner: SandboxContract<TreasuryContract>
  let deployer: SandboxContract<TreasuryContract>
  let gameManager: SandboxContract<GameManager>

  beforeEach(async () => {
    blockchain = await Blockchain.create()

    owner = await blockchain.treasury("owner")
    gameManager = blockchain.openContract(
      await GameManager.fromInit(owner.address),
    )

    deployer = await blockchain.treasury("deployer")

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

    const player = await blockchain.treasury("user")

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

    const player = await blockchain.treasury("user")

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

    const player = await blockchain.treasury("user")

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

  // TODO: Make it faster
  xit("check bounce level", async () => {
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

    const player = await blockchain.treasury("user")

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

    await new Promise((resolve) => setTimeout(resolve, 185000))

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

    const player = await blockchain.treasury("user")

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

    const player = await blockchain.treasury("user")

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

    const player = await blockchain.treasury("user")

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
        value: toNano("0.005"),
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

    const player = await blockchain.treasury("user")

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
})
