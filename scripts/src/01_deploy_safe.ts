import { SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit'
import { EthersAdapter } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()
interface Config {
  RPC_URL: string
  DEPLOYER_ADDRESS_PRIVATE_KEY: string
  DEPLOY_SAFE: {
    OWNERS: string[]
    THRESHOLD: number
    SALT_NONCE: string
    FALLBACK_HANDLER?: string | undefined
  }
}

const config: Config = {
  RPC_URL: process.env.RPC_URL!,
  DEPLOYER_ADDRESS_PRIVATE_KEY: process.env.PROJECT_ADMIN_SK!,
  DEPLOY_SAFE: {
    OWNERS: [process.env.PROJECT_ADMIN_PK!],
    THRESHOLD: 1,
    SALT_NONCE: ethers.utils.hexlify(parseInt(process.env.SAFE_NONCE!))
  }
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
  const safeVersion = '1.4.1'
  // const safeVersion = '1.3.0'
  const safeFactory = await SafeFactory.create({ ethAdapter, safeVersion })

  // Config of the deployed Safe
  const safeAccountConfig: SafeAccountConfig = {
    owners: config.DEPLOY_SAFE.OWNERS,
    threshold: config.DEPLOY_SAFE.THRESHOLD,
    // fallbackHandler: config.DEPLOY_SAFE.FALLBACK_HANDLER
  }
  const saltNonce = config.DEPLOY_SAFE.SALT_NONCE

  // Predict deployed address
  const predictedDeploySafeAddress = await safeFactory.predictSafeAddress(
    safeAccountConfig,
    saltNonce
  )

  console.log('Predicted deployed Safe address:', predictedDeploySafeAddress)

  function callback(txHash: string) {
    console.log('Transaction hash:', txHash)
  }

  // Deploy Safe
  const safe = await safeFactory.deploySafe({
    safeAccountConfig,
    saltNonce,
    callback
  })

  const addr = await safe.getAddress()
  console.log('Deployed Safe:', addr)
}

main()
