import {
  Blockchain,
  printTransactionFees,
  SandboxContract,
  TreasuryContract,
} from "@ton/sandbox"
import { toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { IntroductionLevelFactory } from "../wrappers/IntroductionLevelFactory"
import { IntroductionLevel } from "../wrappers/IntroductionLevel"
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

  it("should deploy", async () => {
    // the check is done inside beforeEach
    // blockchain and gameManager are ready to use
  })

  it("create level happy path", async () => {
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
        name: "introduction",
        factory: introductionLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    const player = await blockchain.treasury("user")

    let createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CreateLevel",
        name: "a",
      },
    )

    expect(createLevelResult.transactions).toHaveTransaction({
      from: player.address,
      to: gameManager.address,
      success: false,
    })

    createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CreateLevel",
        name: "introduction",
      },
    )

    // TODO: Remove?
    printTransactionFees(createLevelResult.transactions)

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

    console.log(await playerStats.getLevels())

    // TODO: Check contract balances
  })

  it("check level happy path", async () => {
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
        name: "introduction",
        factory: introductionLevelFactory.address,
      },
    )

    expect(registerResult.transactions).toHaveTransaction({
      from: owner.address,
      to: gameManager.address,
      success: true,
    })

    const player = await blockchain.treasury("user")

    const createLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CreateLevel",
        name: "introduction",
      },
    )

    // TODO: Remove?
    printTransactionFees(createLevelResult.transactions)

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

    let checkLevelResult = await gameManager.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "CheckLevel",
        name: "introduction",
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

    console.log(await playerStats.getLevels())

    const completeLevelResult = await level.send(
      player.getSender(),
      {
        value: toNano("0.05"),
      },
      "complete",
    )

    expect(completeLevelResult.transactions).toHaveTransaction({
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
        name: "introduction",
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

    console.log(await playerStats.getLevels())

    // TODO: Check contract balances
  })
})
