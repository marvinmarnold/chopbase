import { Contract, BigNumber, utils as ethersUtils, BigNumberish, ethers,  utils, Signer } from 'ethers'
import * as dotenv from 'dotenv'
import {
  EntryPoint__factory,
 } from '@account-abstraction/contracts'
 import { AddressZero } from '@ethersproject/constants'
import FallbackHandler from '../../contracts/out/FallbackHandler.sol/FallbackHandler.json'  assert { type: "json" };
import SomeNft from '../../contracts/out/SomeNft.sol/SomeNft.json'  assert { type: "json" };
import DeployerContract from '../../contracts/out/CreateCall.sol/CreateCall.json'  assert { type: "json" };
import { IBundler, Bundler } from '@biconomy/bundler'
import { ChainId } from "@biconomy/core-types";

// Doesn't support gnosis. polygon complains about prefund not being paid
// { code: -32500, message: "AA21 didn't pay prefund", data: undefined }

dotenv.config()
// official
const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const chainId = ChainId.POLYGON_MUMBAI

type UserOperation = {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  signature: string;
};

const SAFE_ADDRESS = process.env.SAFE_ADDRESS!
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
const deployerSigner = new ethers.Wallet(process.env.PROJECT_ADMIN_SK!, provider)
const entryPoint = EntryPoint__factory.connect(
	ENTRY_POINT_ADDRESS,
	provider,
)
const deployerAddress = process.env.DEPLOYER_CONTRACT_ADDRESS!

/*
  SANITY CHECKS
*/
// Check safe code
// console.log("Checking contract code for safe " + SAFE_ADDRESS)
// console.log(await provider.getCode(SAFE_ADDRESS))

/*
  Prepare USEROP
*/

const pimlicoApiKey = process.env.PIMLICO_API_KEY!
const chain = process.env.PIMLICO_CHAIN 
const pimlicoEndpoint = `https://api.pimlico.io/v1/${chain}/rpc?apikey=${pimlicoApiKey}`
const pimlicoProvider = new ethers.providers.StaticJsonRpcProvider(pimlicoEndpoint)
const feeData = await provider.getFeeData();
const maxFeePerGas = feeData.maxFeePerGas!;
console.log("maxFeePerGas ", maxFeePerGas)
const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!;
console.log("maxPriorityFeePerGas ", maxPriorityFeePerGas)

// Encode deployment
const deployerInterface = new ethers.utils.Interface(DeployerContract.abi);
const deployCallData = deployerInterface.encodeFunctionData("performCreate", [0, SomeNft.bytecode.object])

// Encode safe operation
const fallbackHandlerInterface = new ethers.utils.Interface(FallbackHandler.abi);
const userOpCallData = fallbackHandlerInterface.encodeFunctionData("execTransaction", [deployerAddress, 0, deployCallData]);
// const userOpCallData = fallbackHandlerInterface.encodeFunctionData("execTransaction", [AddressZero, 0, SomeNft.bytecode.object]);

const userOp: UserOperation = {
  sender: SAFE_ADDRESS,
  nonce: ethers.utils.hexlify(parseInt(process.env.USEROP_NONCE!)),
  initCode: "0x",
  callData: userOpCallData,
  callGasLimit: ethers.utils.hexlify(1_000_000), // hardcode it for now at a high value
  verificationGasLimit: ethers.utils.hexlify(4_000_000), // hardcode it for now at a high value
  preVerificationGas: ethers.utils.hexlify(5_000_000), // hardcode it for now at a high value
  maxFeePerGas: ethers.utils.hexlify(maxFeePerGas),
  maxPriorityFeePerGas: ethers.utils.hexlify(maxPriorityFeePerGas),
  paymasterAndData: "0x",
  signature: "0x",
};

// const estimatedGas = await pimlicoProvider.send("eth_estimateUserOperationGas", [userOp, ENTRY_POINT_ADDRESS]);
// console.log({ estimatedGas });

console.log("Built userOp")
console.log(userOp)

console.log("About to get opHash")
const userOpHash = await entryPoint.getUserOpHash(userOp)
console.log("Got " + userOpHash )
const userOpHashArr =  ethers.utils.arrayify(userOpHash)
// SIGN THE USER OPERATION
const signature = await deployerSigner.signMessage(userOpHashArr)

console.log("UserOperation signature:", signature)
userOp.signature = signature

/*
    SEND USEROP
*/

// SUBMIT THE USER OPERATION TO BE BUNDLED
const bundler: IBundler = new Bundler({
  // address here: https://dashboard.biconomy.io/bundlers
  bundlerUrl: `https://bundler.biconomy.io/api/v2/${chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,      
  chainId,
  entryPointAddress: ENTRY_POINT_ADDRESS,
})

// Send userop
try {
  // console.log("estimating gas")
  // const est = await bundler.estimateUserOpGas(userOp)
  // console.log(est.callGasLimit)
  const userResp = await bundler.sendUserOp(userOp)
    console.log("Got userOp RESP")
    console.log(userResp.userOpHash)
    console.log(userResp)
} catch (e) {
    console.error("Unknown error")
    console.error(e)
}