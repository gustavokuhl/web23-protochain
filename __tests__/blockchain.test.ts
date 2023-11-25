import { describe } from "@jest/globals"
import Blockchain from "../src/lib/blockchain"

describe("Blockchain tests", () => {
  test("Should have genesis block", () => {
    const blockchain = new Blockchain()
    expect(blockchain.blocks.length).toBeGreaterThanOrEqual(1)
  })
})
