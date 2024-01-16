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
  mempool: Transaction[]
  nextIndex: number = 0
  static readonly TX_PER_BLOCK = 2
  static readonly DIFFICULTY_FACTOR = 5
  static readonly MAX_DIFFICULTY = 62

  /**
   * Creates a new Blockchain
   */
  constructor() {
    this.mempool = [] as Transaction[]
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

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid()
    if (!validation.success)
      return new Validation(false, "Invalid tx: " + validation.message)

    if (
      this.blocks.some((b) =>
        b.transactions.some((tx) => tx.hash === transaction.hash)
      )
    )
      return new Validation(false, "Duplicated transaction in blockchain")

    if (this.mempool.some((tx) => tx.hash === transaction.hash))
      return new Validation(false, "Duplicated transaction in mempool")

    this.mempool.push(transaction)
    return new Validation(true, transaction.hash)
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

    const txs = block.transactions
      .filter((tx) => tx.type !== TransactionType.FEE)
      .map((tx) => tx.hash)
    const newMempool = this.mempool.filter((tx) => !txs.includes(tx.hash))
    if (newMempool.length + txs.length !== this.mempool.length)
      return new Validation(false, "Invalid tx in block: mempool")

    this.mempool = newMempool

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
  getNextBlock(): BlockInfo | null {
    if (!this.mempool || !this.mempool.length) return null

    const transactions = this.mempool.slice(0, Blockchain.TX_PER_BLOCK)
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
