import { describe } from "@jest/globals"
import Block from "../src/lib/block"
import BlockInfo from "../src/lib/blockInfo"
import Transaction from "../src/lib/transaction"
import TransactionInput from "../src/lib/transactionInput"
import { TransactionType } from "../src/lib/transactionType"

jest.mock("../src/lib/transaction")
jest.mock("../src/lib/transactionInput")

describe("Block tests", () => {
  const exampleDifficulty = 0
  const exampleMiner = "r4to"
  let genesis: Block

  beforeAll(() => {
    genesis = new Block({
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block)
  })

  test("Should be a valid block", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
          to: "toAddress",
        } as Transaction),
      ],
    } as Block)
    block.mine(exampleDifficulty, exampleMiner)
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeTruthy()
  })

  test("Should create from block info", () => {
    const block = Block.fromBlockInfo({
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
          to: "toAddress",
        } as Transaction),
      ],
      difficulty: 0,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash,
    } as BlockInfo)
    block.mine(exampleDifficulty, exampleMiner)

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeTruthy()
  })

  test("Should NOT be valid block (fallbacks)", () => {
    const block = new Block()
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeFalsy()
  })

  test("Should NOT be valid (txInput)", () => {
    const txInput = new TransactionInput()
    txInput.amount = -1

    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput,
        } as Transaction),
      ],
    } as Block)

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (wrong previous hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: "wrong hash",
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
          to: "toAddress",
        } as Transaction),
      ],
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (empty previous hash)", () => {
    const block = new Block({
      index: 1,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
          to: "toAddress",
        } as Transaction),
      ],
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (transactions)", () => {
    const tx = new Transaction()

    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [tx],
    } as Block)

    block.mine(exampleDifficulty, exampleMiner)
    block.transactions[0].to = ""

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ],
    } as Block)
    block.mine(exampleDifficulty, exampleMiner)

    block.hash = ""

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (no mined)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
          to: "toAddress",
        } as Transaction),
      ],
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
          to: "toAddress",
        } as Transaction),
      ],
    } as Block)
    block.timestamp = -1
    block.hash = block.getHash()
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (two FEE transactions)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          txInput: new TransactionInput(),
          to: "toAddress",
        } as Transaction),
        new Transaction({
          type: TransactionType.FEE,
          txInput: new TransactionInput(),
          to: "toAddress",
        } as Transaction),
      ],
    } as Block)
    block.hash = block.getHash()
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty)
    expect(valid.success).toBeFalsy()
  })
})
