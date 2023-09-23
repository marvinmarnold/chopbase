import { SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit'
import { EthersAdapter } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv'
import Safe from '@safe-global/protocol-kit/dist/src/Safe.js'

dotenv.config()

interface Config {
  RPC_URL: string
  DEPLOYER_ADDRESS_PRIVATE_KEY: string
  SAFE_ADDRESS: string
  HANDLER_ADDRESS: string
}

const config: Config = {
  RPC_URL: process.env.RPC_URL!,
  DEPLOYER_ADDRESS_PRIVATE_KEY: process.env.PROJECT_ADMIN_SK!,
  SAFE_ADDRESS: process.env.SAFE_ADDRESS!,
  HANDLER_ADDRESS: process.env.HANDLER_ADDRESS!
}
console.log("Using config")
console.log(config)

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL)
  const deployerSigner = new ethers.Wallet(config.DEPLOYER_ADDRESS_PRIVATE_KEY, provider)

  // Create EthAdapter instance
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: deployerSigner
  })
 
  // Create SafeFactory instance
  const safeSdk = await Safe.default.create({ethAdapter, safeAddress: config.SAFE_ADDRESS})

  const safeTransaction = await safeSdk.createEnableFallbackHandlerTx(config.HANDLER_ADDRESS)
  const txResponse = await safeSdk.executeTransaction(safeTransaction)
  console.log("Executed default handler transaction")
  console.log(txResponse)

  const resp = await txResponse.transactionResponse?.wait()
  console.log("Parsed default handler response")
  console.log(resp)

  const moduleTx = await safeSdk.createEnableModuleTx(config.HANDLER_ADDRESS)
  const txResponse2 = await safeSdk.executeTransaction(moduleTx)
  console.log("Executed add module transaction")
  console.log(txResponse2)

  const resp2 = await txResponse2.transactionResponse?.wait()
  console.log("Parsed add module response")
  console.log(resp2)
}

main()
