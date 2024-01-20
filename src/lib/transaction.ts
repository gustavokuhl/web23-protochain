import { SHA256 } from "crypto-js"
import TransactionInput from "./transactionInput"
import { TransactionType } from "./transactionType"
import Validation from "./validation"

/**
 * Transaction class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  hash: string
  txInput: TransactionInput
  to: string

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.txInput = tx?.txInput || new TransactionInput()
    this.to = tx?.to || ""
    this.hash = tx?.hash || this.getHash()
  }

  getHash() {
    return SHA256(
      this.type + this.txInput.getHash() + this.to + this.timestamp
    ).toString()
  }

  isValid() {
    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid Hash.")

    if (!this.to) return new Validation(false, "Invalid to.")

    return new Validation()
  }
}
