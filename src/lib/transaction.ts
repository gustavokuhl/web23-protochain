import { SHA256 } from "crypto-js"
import { TransactionType } from "./transactionType"
import Validation from "./validation"

/**
 * Transaction class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  hash: string
  data: string

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.data = tx?.data || ""
    this.hash = tx?.hash || this.getHash()
  }

  getHash() {
    return SHA256(this.type + this.timestamp + this.data).toString()
  }

  isValid() {
    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid Hash.")

    if (!this.data) return new Validation(false, "Invalid Data.")

    return new Validation()
  }
}
