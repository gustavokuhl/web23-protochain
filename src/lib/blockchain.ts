import Block from "./block"

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[]

  /**
   * Creates a new Blockchain
   */
  constructor() {
    let block = new Block(0, "genesis")
    this.blocks = [block]
  }
}