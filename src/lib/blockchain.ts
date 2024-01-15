import Block from "./block"
import BlockInfo from "./blockInfo"
import Transaction from "./transaction"
import { TransactionType } from "./transactionType"
import Validation from "./validation"

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[]
  nextIndex: number = 0
  static readonly DIFFICULTY_FACTOR = 5
  static readonly MAX_DIFFICULTY = 62

  /**
   * Creates a new Blockchain
   */
  constructor() {
    this.blocks = [
      new Block({
        index: this.nextIndex,
        previousHash: "genesis",
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: new Date().toString(),
          } as Transaction),
        ],
      } as Block),
    ]

    this.nextIndex++
  }

  /**
   * Get blockchain last block
   * @returns A block object
   */
  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  /**
   * Get blockchain current difficulty
   * @returns The difficulty value
   */
  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR)
  }

  /**
   * Adds a block to the blockchain
   * @param block A valid block object to be added
   * @returns A Validation indicating success or failure. Returns a message if the block if invalid.
   */
  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock()

    const validation = block.isValid(
      lastBlock.hash,
      lastBlock.index,
      this.getDifficulty()
    )
    if (!validation.success)
      return new Validation(false, `Invalid block: ${validation.message}`)

    this.blocks.push(block)
    this.nextIndex++

    return new Validation()
  }

  /**
   * Gets a blockchain block by the hash value
   * @param hash A sha256 hash of a valid block
   * @returns A Block if the hash exists in the blockchain, and a undefined value if doesn't
   */
  getBlock(hash: string): Block | undefined {
    this.isValid()
    return this.blocks.find((b) => b.hash === hash)
  }

  /**
   * Verifies if the blockchain is valid
   * @returns A Validation indicating success or failure. Returns a message if the block if invalid.
   */
  isValid(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]
      const validation = currentBlock.isValid(
        previousBlock.hash,
        previousBlock.index,
        this.getDifficulty()
      )
      if (!validation.success)
        return new Validation(
          false,
          `Invalid block #${currentBlock.index}: ${validation.message}`
        )
    }
    return new Validation()
  }

  /**
   * Gets the blockchain fee per transaction value
   * @returns The fee value
   */
  getFeePerTx(): number {
    return 1
  }

  /**
   * Gets the blockchain next block info
   * @returns The block info
   */
  getNextBlock(): BlockInfo {
    const transactions = [
      new Transaction({
        data: new Date().toString(),
      } as Transaction),
    ]
    const difficulty = this.getDifficulty()
    const previousHash = this.getLastBlock().hash
    const index = this.blocks.length
    const feePerTx = this.getFeePerTx()
    const maxDifficulty = Blockchain.MAX_DIFFICULTY
    return {
      transactions,
      difficulty,
      previousHash,
      index,
      feePerTx,
      maxDifficulty,
    } as BlockInfo
  }
}
