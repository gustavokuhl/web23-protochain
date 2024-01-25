import TransactionInput from "../transactionInput"
import { TransactionType } from "../transactionType"
import Validation from "../validation"

/**
 * Mocked Transaction class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  hash: string
  to: string
  txInput: TransactionInput

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.to = tx?.to || "toAddress"
    this.txInput = tx?.txInput
      ? new TransactionInput(tx?.txInput)
      : new TransactionInput()
    this.hash = tx?.hash || this.getHash()
  }

  getHash() {
    return "abc"
  }

  isValid() {
    if (!this.to) return new Validation(false, "Invalid mocked to transaction.")
    if (!this.txInput.isValid().success)
      return new Validation(false, "Invalid tx input.")
    return new Validation()
  }
}
