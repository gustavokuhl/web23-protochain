import BlockInfo from "../blockInfo"
import TransactionSearch from "../transactionSearch"
import { TransactionType } from "../transactionType"
import Validation from "../validation"
import Block from "./block"
import Transaction from "./transaction"

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
  blocks: Block[]
  mempool: Transaction[]
  nextIndex: number = 0

  /**
   * Creates a new Mocked Blockchain
   */
  constructor() {
    this.mempool = []
    this.blocks = [
      new Block({
        index: 0,
        hash: "genesis",
        previousHash: "",
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: "Genesis Block",
            hash: "genesis",
          } as Transaction),
        ],
        timestamp: Date.now(),
      } as Block),
    ]

    this.nextIndex++
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  addBlock(block: Block): Validation {
    if (block.index < 0) return new Validation(false, "Invalid mock block.")

    this.blocks.push(block)
    this.nextIndex++

    return new Validation()
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find((b) => b.hash === hash)
  }

  isValid(): Validation {
    return new Validation()
  }

  getFeePerTx(): number {
    return 1
  }

  getNextBlock(): BlockInfo {
    return {
      transactions: [
        new Transaction({
          data: new Date().toString(),
        } as Transaction),
      ],
      difficulty: 0,
      previousHash: this.getLastBlock().hash,
      index: 1,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: 62,
    } as BlockInfo
  }

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid()
    if (!validation.success) return validation

    this.mempool.push(transaction)
    return new Validation()
  }

  getTransaction(hash: string): TransactionSearch {
    return {
      mempoolIndex: 0,
      transaction: {
        hash,
      },
    } as TransactionSearch
  }
}
