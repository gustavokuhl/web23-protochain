import Block from "./block"

export default class Blockchain {
  blocks: Block[]

  constructor() {
    let block = new Block(0, "genesis")
    this.blocks = [block]
  }
}
