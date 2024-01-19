import { describe } from "@jest/globals"
import Block from "../src/lib/block"
import Blockchain from "../src/lib/blockchain"
import Transaction from "../src/lib/transaction"

jest.mock("../src/lib/block")
jest.mock("../src/lib/transaction")

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
        transactions: [new Transaction({ data: "Bloco 2" } as Transaction)],
      } as Block)
    )
    expect(blockchain.isValid().success).toEqual(true)
  })

  test("Should NOT be valid", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({ data: "tx1" } as Transaction)
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
    const tx = new Transaction({ data: "tx1", hash: "123" } as Transaction)
    const valid = blockchain.addTransaction(tx)
    expect(valid.success).toBeTruthy()
  })

  test("Should NOT add transaction (invalid data)", () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({ hash: "123" } as Transaction)
    const valid = blockchain.addTransaction(tx)
    expect(valid.success).toBeFalsy()
  })

  test("Should NOT add transaction (duplicated in blockchain)", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({ data: "tx1", hash: "123" } as Transaction)
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

    const tx = new Transaction({ data: "tx1", hash: "123" } as Transaction)
    blockchain.mempool.push(tx)

    const result = blockchain.addTransaction(tx)
    expect(result.success).toBeFalsy()
  })

  test("Should add transaction (mempool)", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({ data: "tx1", hash: "123" } as Transaction)
    blockchain.addTransaction(tx)

    const result = blockchain.getTransaction(tx.hash)
    expect(result.mempoolIndex).toEqual(0)
  })

  test("Should get transaction (blockchain)", () => {
    const blockchain = new Blockchain()

    const tx = new Transaction({ data: "tx1", hash: "123" } as Transaction)
    blockchain.addTransaction(tx)

    const result = blockchain.getTransaction(tx.hash)
    expect(result.mempoolIndex).toEqual(0)
  })

  test("Should get transaction (blockchain)", () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({ data: "tx1", hash: "123" } as Transaction)

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

    const tx = new Transaction({ data: "Bloco 2" } as Transaction)
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
    const tx = new Transaction({ data: "tx1" } as Transaction)
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
    blockchain.mempool.push(new Transaction({ data: "tx1" } as Transaction))
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
    const tx = new Transaction({ data: "tx2", hash: "123" } as Transaction)
    const valid = blockchain.addTransaction(tx)
    expect(valid.success).toBeTruthy()
  })

  test("Should NOT add transaction (data)", () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({ hash: "123" } as Transaction)

    const valid = blockchain.addTransaction(tx)
    expect(valid.success).toBeFalsy()
  })
})
