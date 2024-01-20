import { SHA256 } from "crypto-js"
import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"
import Validation from "./validation"

const ECPair = ECPairFactory(ecc)

/**
 * TransactionInput class
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
    this.fromAddress = txInput?.fromAddress || ""
    this.amount = txInput?.amount || 0
    this.signature = txInput?.signature || ""
  }

  /**
   * Generate the tx input signature
   * @param privateKey The [from] wallet private key
   */
  sign(privateKey: string): void {
    this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"))
      .sign(Buffer.from(this.getHash(), "hex"))
      .toString()
  }

  /**
   * Generates the tx input hash
   * @returns The hash value
   */
  getHash(): string {
    return SHA256(this.fromAddress + this.amount).toString()
  }

  /**
   * Validates if the tx input is valid
   * @returns The Validation result object
   */
  isValid(): Validation {
    if (!this.signature) return new Validation(false, "Signature is required.")
    if (this.amount < 1)
      return new Validation(false, "Amount must be greater than zero.")

    const hash = Buffer.from(this.getHash(), "hex")
    const isValid = ECPair.fromPublicKey(
      Buffer.from(this.fromAddress, "hex")
    ).verify(hash, Buffer.from(this.signature, "hex"))

    return isValid
      ? new Validation()
      : new Validation(false, "Invalid tx input signature.")
  }
}
