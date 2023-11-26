import { describe } from "@jest/globals"
import Block from "../src/lib/block"

describe("Block tests", () => {
  let genesis: Block

  beforeAll(() => {
    genesis = new Block({
      data: "Genesis Block",
    } as Block)
  })

  test("Should be a valid block", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Bloco 2",
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid.success).toBeTruthy()
  })

  test("Should NOT be valid block (fallbacks)", () => {
    const block = new Block()
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (wrong previous hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: "wrong hash",
      data: "Bloco 2",
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (empty previous hash)", () => {
    const block = new Block({
      index: 1,
      data: "Bloco 2",
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      data: "Bloco 2",
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Bloco 2",
    } as Block)
    block.hash = ""
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid.success).toBeFalsy()
  })

  test("Should be falsy (timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Bloco 2",
    } as Block)
    block.timestamp = -1
    block.hash = block.getHash()
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid.success).toBeFalsy()
  })
})
