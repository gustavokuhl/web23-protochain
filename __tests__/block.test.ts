import { describe } from "@jest/globals"
import Block from "../src/lib/block"

describe("Block tests", () => {
  let genesis: Block

  beforeAll(() => {
    genesis = new Block(0, "", "Genesis Block")
  })

  test("Should be a valid block", () => {
    const block = new Block(1, genesis.hash, "bloco 1")
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid).toBeTruthy()
  })
  test("Should be falsy (wrong previous hash)", () => {
    const block = new Block(1, "wrong hash", "bloco")
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid).toBeFalsy()
  })
  test("Should be falsy (empty previous hash)", () => {
    const block = new Block(1, "", "bloco")
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid).toBeFalsy()
  })
  test("Should be falsy (index)", () => {
    const block = new Block(-1, genesis.hash, "bloco 1")
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid).toBeFalsy()
  })
  test("Should be falsy (data)", () => {
    const block = new Block(1, genesis.hash, "")
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid).toBeFalsy()
  })
  test("Should be falsy (hash)", () => {
    const block = new Block(1, genesis.hash, "bloco 1")
    block.hash = ""
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid).toBeFalsy()
  })
  test("Should be falsy (timestamp)", () => {
    const block = new Block(1, genesis.hash, "bloco 1")
    block.timestamp = -1
    block.hash = block.getHash()
    const valid = block.isValid(genesis.hash, genesis.index)
    expect(valid).toBeFalsy()
  })
})
