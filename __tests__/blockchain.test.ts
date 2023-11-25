import { describe } from "@jest/globals"
import Blockchain from "../src/lib/blockchain"
import Block from "../src/lib/block"

describe("Blockchain tests", () => {
  test("Should have genesis block", () => {
    const blockchain = new Blockchain()
    expect(blockchain.blocks.length).toEqual(1)
  })
  test("Should be valid (genesis)", () => {
    const blockchain = new Blockchain()
    expect(blockchain.isValid()).toEqual(true)
  })
  test("Should be valid (two blocks)", () => {
    const blockchain = new Blockchain()
    blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "bloco 1"))
    expect(blockchain.isValid()).toEqual(true)
  })
  test("Should NOT be valid", () => {
    const blockchain = new Blockchain()
    blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "bloco 1"))
    blockchain.blocks[1].data = "new data"
    expect(blockchain.isValid()).toEqual(false)
  })
  test("Should add a block", () => {
    const blockchain = new Blockchain()
    const result = blockchain.addBlock(
      new Block(1, blockchain.blocks[0].hash, "bloco 1")
    )
    expect(result).toEqual(true)
  })
  test("Should NOT add a block", () => {
    const blockchain = new Blockchain()
    const result = blockchain.addBlock(new Block(1, "wrong hash", "bloco 1"))
    expect(result).toEqual(false)
  })
})
