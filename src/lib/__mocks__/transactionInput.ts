import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"
import Validation from "../validation"

const ECPair = ECPairFactory(ecc)

/**
 * Mocked TransactionInput class
 */
export default class TransactionInput {
  fromAddress: string
  amount: number
  signature: string

  /**
   * Creates a new TransactionInput
   * @param txInput The tx input data
   */
  constructor(txInput?: TransactionInput) {
    this.fromAddress = txInput?.fromAddress || "carteira1"
    this.amount = txInput?.amount || 10
    this.signature = txInput?.signature || "abc"
  }

  /**
   * Generate the tx input signature
   * @param privateKey The [from] wallet private key
   */
  sign(privateKey: string): void {
    this.signature = "abc"
  }

  /**
   * Generates the tx input hash
   * @returns The hash value
   */
  getHash(): string {
    return "abc"
  }

  /**
   * Validates if the tx input is valid
   * @returns The Validation result object
   */
  isValid(): Validation {
    if (!this.signature) return new Validation(false, "Signature is required.")
    if (this.amount < 1)
      return new Validation(false, "Amount must be greater than zero.")

    return new Validation()
  }
}
