import Wallet from "../lib/wallet"

console.log("Create new wallet")
const wallet = new Wallet()
console.log(wallet)

console.log()

console.log("Recover wallet from private key")
const recoverWallet = new Wallet(wallet.privateKey)
console.log(recoverWallet)
