import { describe } from "@jest/globals"
import Block from "../src/lib/block"
import Blockchain from "../src/lib/blockchain"
import Transaction from "../src/lib/transaction"
import TransactionInput from "../src/lib/transactionInput"

jest.mock("../src/lib/block")
jest.mock("../src/lib/transaction")
jest.mock("../src/lib/transactionInput")

describe("Blockchain tests", () => {
  test("Should have genesis block", () => {
    const blockchain = new Blockchain()
    expect(blockchain.blocks.length).toEqual(1)
  })

  test("Should be valid (genesis)", () => {
    const blockchain = new Blockchain()
    expect(blockchain.isValid().success).toEqual(true)
  })

  test("Should be valid (two blocks)", () => {
    const blockchain = new Blockchain()
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({ txInput: new TransactionInput() } as Transaction),
        ],
      } as Block)
    )
    expect(blockchain.isValid().success).toEqual(true)
  })

  test("Should NOT be valid", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({
      txInput: new TransactionInput(),
    } as Transaction)
    blockchain.mempool.push(tx)

    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    )

    blockchain.blocks[1].index = -1
    expect(blockchain.isValid().success).toEqual(false)
  })

  test("Should add transaction", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({
      txInput: new TransactionInput({ amount: 13 } as TransactionInput),
    } as Transaction)
    tx.hash = "123"

    const valid = blockchain.addTransaction(tx)
    expect(valid.success).toBeTruthy()
  })

  test("Should NOT add transaction (duplicated in blockchain)", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({
      txInput: new TransactionInput(),
    } as Transaction)
    blockchain.blocks.push(
      new Block({
        transactions: [tx],
      } as Block)
    )

    const valid = blockchain.addTransaction(tx)
    expect(valid.success).toBeFalsy()
  })

  test("Should NOT add transaction (duplicated in mempool)", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: "xyz",
    } as Transaction)
    blockchain.mempool.push(tx)

    const result = blockchain.addTransaction(tx)
    expect(result.success).toBeFalsy()
  })

  test("Should get transaction (blockchain)", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({
      hash: "xyz",
      txInput: new TransactionInput(),
    } as Transaction)
    blockchain.addTransaction(tx)

    const result = blockchain.getTransaction(tx.hash)
    expect(result.mempoolIndex).toEqual(0)
  })

  test("Should get transaction (blockchain)", () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      hash: "xyz",
      txInput: new TransactionInput(),
    } as Transaction)

    blockchain.blocks.push(
      new Block({
        transactions: [tx],
      } as Block)
    )

    const result = blockchain.getTransaction(tx.hash)
    expect(result.blockIndex).toEqual(1)
  })

  test("Should NOT get transaction", () => {
    const blockchain = new Blockchain()
    const result = blockchain.getTransaction("123")
    expect(result.blockIndex).toEqual(-1)
    expect(result.mempoolIndex).toEqual(-1)
  })

  test("Should add block", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({
      txInput: new TransactionInput(),
    } as Transaction)
    blockchain.mempool.push(tx)

    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    )
    expect(result.success).toEqual(true)
  })

  test("Should NOT add a block", () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      txInput: new TransactionInput(),
    } as Transaction)
    blockchain.mempool.push(tx)

    const result = blockchain.addBlock(
      new Block({
        index: 1,
        transactions: [tx],
      } as Block)
    )
    expect(result.success).toEqual(false)
  })

  test("Should get block", () => {
    const blockchain = new Blockchain()
    const block = blockchain.getBlock(blockchain.blocks[0].hash)
    expect(block).toBeTruthy()
  })

  test("Should get next block info", () => {
    const blockchain = new Blockchain()
    blockchain.mempool.push(
      new Transaction({ txInput: new TransactionInput() } as Transaction)
    )
    const info = blockchain.getNextBlock()
    expect(info ? info.index : 0).toEqual(1)
  })

  test("Should NOT get next block info", () => {
    const blockchain = new Blockchain()
    const info = blockchain.getNextBlock()
    expect(info).toBeNull()
  })

  test("Should add transaction", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({
      hash: "xyz",
      txInput: new TransactionInput(),
    } as Transaction)

    const valid = blockchain.addTransaction(tx)
    expect(valid.success).toBeTruthy()
  })

  test("Should NOT add transaction (data)", () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      hash: "123",
      txInput: new TransactionInput({ amount: -1 } as TransactionInput),
    } as Transaction)

    const valid = blockchain.addTransaction(tx)
    expect(valid.success).toBeFalsy()
  })
})
