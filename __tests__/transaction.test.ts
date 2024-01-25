import { describe } from "@jest/globals"
import Block from "../src/lib/block"
import Transaction from "../src/lib/transaction"
import TransactionInput from "../src/lib/transactionInput"
import { TransactionType } from "../src/lib/transactionType"

jest.mock("../src/lib/transactionInput")

describe("Block tests", () => {
  const exampleDifficulty = 0
  const exampleMiner = "r4to"
  let genesis: Block

  test("Should be a valid block", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "toAddress",
    } as Transaction)

    const valid = tx.isValid()
    expect(valid.success).toBeTruthy()
  })

  test("Should be a valid block", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "toAddress",
      type: TransactionType.FEE,
    } as Transaction)

    const valid = tx.isValid()
    expect(valid.success).toBeTruthy()
  })

  test("Should not be a valid block (hash)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "toAddress",
      type: TransactionType.FEE,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction)

    const valid = tx.isValid()
    expect(valid.success).toBeFalsy()
  })

  test("Should not be a valid block (empty)", () => {
    const tx = new Transaction()
    const valid = tx.isValid()
    expect(valid.success).toBeFalsy()
  })
})
