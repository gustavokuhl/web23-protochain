/**
 * Black class
 */
export default class Block {
  index: number
  hash: string

  /**
   * Creates a new Block
   * @param index The block index in the blockchain
   * @param hash The hash of block
   */
  constructor(index: number, hash: string) {
    this.index = index
    this.hash = hash
  }

  /**
   * Verify if the blockchain is valid
   * @returns Return true if the block is valid
   */
  isValid(): boolean {
    if (this.index < 0) return false
    if (!this.hash) return false
    return true
  }
}
