import { TransactionType } from "../transactionType"
import Validation from "../validation"

/**
 * Mocked Transaction class
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
    return "abc"
  }

  isValid() {
    if (!this.data) return new Validation(false, "Invalid mocked transaction.")
    return new Validation()
  }
}
