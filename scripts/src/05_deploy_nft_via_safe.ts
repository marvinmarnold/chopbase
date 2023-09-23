import { Contract, BigNumber, utils as ethersUtils, BigNumberish, ethers,  utils, Signer } from 'ethers'
import * as dotenv from 'dotenv'
 import { AddressZero } from '@ethersproject/constants'
import FallbackHandler from '../../contracts/out/FallbackHandler.sol/FallbackHandler.json'  assert { type: "json" };
import SomeNft from '../../contracts/out/SomeNft.sol/SomeNft.json'  assert { type: "json" };
import DeployerContract from '../../contracts/out/CreateCall.sol/CreateCall.json'  assert { type: "json" };

dotenv.config()

const SAFE_ADDRESS = process.env.SAFE_ADDRESS!
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
const deployerSigner = new ethers.Wallet(process.env.PROJECT_ADMIN_SK!, provider)
const deployerAddress = process.env.DEPLOYER_CONTRACT_ADDRESS!

/*
  Prepare USEROP
*/

const feeData = await provider.getFeeData();
const maxFeePerGas = feeData.maxFeePerGas!;
console.log("maxFeePerGas ", maxFeePerGas)
const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!;
console.log("maxPriorityFeePerGas ", maxPriorityFeePerGas)

// Encode deployment
const deployerInterface = new ethers.utils.Interface(DeployerContract.abi);
const deployCallData = deployerInterface.encodeFunctionData("performCreate", [0, SomeNft.bytecode.object])

// Encode safe op
const fallbackHandlerInterface = new ethers.utils.Interface(FallbackHandler.abi);
// const userOpCallData = fallbackHandlerInterface.encodeFunctionData("execTransaction", [AddressZero, 0, "0x"]);
const userOpCallData = fallbackHandlerInterface.encodeFunctionData("execTransaction", [deployerAddress, 0, deployCallData]);

// Prepare and send the transaction
const tx = {
    to: SAFE_ADDRESS, // this has to be null for contract deployments
    gasLimit: ethers.utils.hexlify(4_000_000), // You should estimate the gas limit
    gasPrice: ethers.utils.parseUnits("20", "gwei"),
    nonce: await deployerSigner.getTransactionCount(), // You can also specify nonce
    data: userOpCallData,
    value: ethers.utils.parseEther("0.0")
};

const txResponse = await deployerSigner.sendTransaction(tx);

console.log("Transaction hash:", txResponse.hash);

// Wait for the transaction to be mined
const receipt = await txResponse.wait();

// The contract address is available in the transaction receipt
const contractAddress = receipt.contractAddress;

console.log("Contract deployed at:", contractAddress);