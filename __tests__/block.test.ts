import { describe } from "@jest/globals"
import Block from "../src/lib/block"

describe("Block tests", () => {
  test("Should be truthy", () => {
    const block = new Block(1, "abc", "bloco")
    const valid = block.isValid()
    expect(valid).toBeTruthy()
  })
  test("Should be falsy (previous hash)", () => {
    const block = new Block(1, "", "bloco")
    const valid = block.isValid()
    expect(valid).toBeFalsy()
  })
  test("Should be falsy (index)", () => {
    const block = new Block(-1, "abc", "bloco")
    const valid = block.isValid()
    expect(valid).toBeFalsy()
  })
  test("Should be falsy (data)", () => {
    const block = new Block(1, "abc", "")
    const valid = block.isValid()
    expect(valid).toBeFalsy()
  })
  test("Should be falsy (hash)", () => {
    const block = new Block(1, "abc", "block")
    block.hash = ""
    const valid = block.isValid()
    expect(valid).toBeFalsy()
  })
  test("Should be falsy (timestamp)", () => {
    const block = new Block(1, "abc", "block")
    block.timestamp = -1
    const valid = block.isValid()
    expect(valid).toBeFalsy()
  })
})
