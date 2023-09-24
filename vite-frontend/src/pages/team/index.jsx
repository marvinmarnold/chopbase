import Header from "../../components/Header"
import { useState, useEffect } from "react"
import {
	PlusIcon,
	MinusIcon,
	ArrowRightIcon,
	DocumentArrowUpIcon,
	CheckIcon,
} from "@heroicons/react/24/outline"
import { Link, useLocation } from "react-router-dom"
import { useBalance, useSendTransaction } from "wagmi"
import useGetOwnersOfSafe from "../../hooks/useGetOwnersOfSafe"
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import CreateCall from '../../abis/CreateCall.json'
import FallbackHandler from '../../abis/FallbackHandler.json'
import { ethers } from 'ethers'
import { AddressZero } from '@ethersproject/constants'
import {
	EntryPoint__factory,
} from '@account-abstraction/contracts'
import { useEthersSigner } from "../../hooks/useEthersSIgner"

const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

export default function Overview() {
	const [uploaded, setUploaded] = useState(false)
	const [bytecode, setBytecode] = useState(null)

	const [balance, setBalance] = useState(0)
	const [toggleAddFunds, setToggleAddFunds] = useState(false)
	const [amountToAdd, setAmountToAdd] = useState(0)

	// get address + team name from URL
	const pageLocation = useLocation()
	const safeAddress = pageLocation.pathname.split("/")[2]
	const teamName = pageLocation.pathname.split("/")[3]

	// read safe balance
	const balanceFetched = useBalance({ address: safeAddress })
	useEffect(() => {
		setBalance(parseFloat(balanceFetched.data.formatted).toFixed(3))
	}, [balanceFetched])

	const owners = useGetOwnersOfSafe(safeAddress)

	// User op
	const signer = useEthersSigner()
	const sendUserOp = async () => {
		const entryPoint = EntryPoint__factory.connect(
			ENTRY_POINT_ADDRESS,
			signer,
		)

		const pimlicoApiKey = import.meta.env.VITE_PIMLICO_API_KEY
		const chain = import.meta.env.VITE_PIMLICO_CHAIN 
		const pimlicoEndpoint = `https://api.pimlico.io/v1/${chain}/rpc?apikey=${pimlicoApiKey}`
		const pimlicoProvider = new ethers.providers.StaticJsonRpcProvider(pimlicoEndpoint)
		const feeData = await signer.getFeeData();
		const maxFeePerGas = feeData.maxFeePerGas;
		console.log("maxFeePerGas ", maxFeePerGas)
		const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
		console.log("maxPriorityFeePerGas ", maxPriorityFeePerGas)
		const fallbackHandlerInterface = new ethers.utils.Interface(FallbackHandler.abi);
		const userOpCallData = fallbackHandlerInterface.encodeFunctionData("execTransaction", [AddressZero, 0, bytecode]);
		console.log(userOpCallData)

		const userOp = {
			sender: safeAddress,
			nonce: ethers.utils.hexlify(parseInt(import.meta.env.VITE_USEROP_NONCE)),
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
		const signature = await signer.signMessage(userOpHashArr)
		
		console.log("UserOperation signature:", signature)
		userOp.signature = signature
		
		/*
			SEND USEROP
		*/
		
		// SUBMIT THE USER OPERATION TO BE BUNDLED
		const userOperationHash = await pimlicoProvider.send("eth_sendUserOperation", [
			userOp,
			ENTRY_POINT_ADDRESS
		])
		
		console.log("UserOperation hash:", userOperationHash)
	}


	// Transaction
	const { sendTransaction: sendAddToSafe } = useSendTransaction({
		to: safeAddress,
		value: amountToAdd,
	})

	useEffect(() => {
		if (!bytecode) return

		// handle abi here (initiate deployment)
	}, [bytecode])

	const handleFileChange = (event) => {
		const file = event.target.files[0]
		if (file && file.type === "application/json") {
			const reader = new FileReader()
			reader.onload = (e) => {
				const content = JSON.parse(e.target.result)
				setBytecode(content.bytecode.object)
				setUploaded(true)
			}
			reader.readAsText(file)
		} else {
			alert("Please upload a valid JSON file.")
		}
	}

	const { config, error, isError } = usePrepareContractWrite({
		abi: CreateCall.abi,
		enabled: !!bytecode,
		functionName: 'performCreate',
		address: '0x4452E69CfFb10F8f851FE71bfa447b44BCdB8a64',
		args: [0, bytecode],
	})

	const { data, isLoading: writeLoading, isError: writeError, write } = useContractWrite(config)

	const { isLoading: isContractLoading, isSuccess: writeSuccess } = useWaitForTransaction({
		hash: data?.hash,
	})

	useEffect(() => {
		console.log("Write was successful " + writeSuccess)
		console.log(data?.hash)
	}, [writeSuccess])

	const deploy = async () => {
		console.log("Writing contract")
		await sendUserOp()
		await write()
	}

	return (
		<>
			<Header />
			{/* MENU */}
			<div className="flex w-full flex-col space-y-0">
				<div className="flex flex-row mx-[20%] space-x-[4rem] font-medium">
					<div>
						<button className="underline underline-offset-[7px]">Overview</button>
					</div>
					<div>
						<Link to="members">
							<button>Members</button>
						</Link>
					</div>
					<div>
						<Link to="contracts">
							<button>Contracts deployed</button>
						</Link>
					</div>
				</div>
				<div className="bg-[#CECFD6] h-[1px] w-full">&nbsp; </div>
			</div>
			{/* MAIN content */}
			<div className="flex w-full h-screen bg-[#E5E6EC]">
				{/* STATS */}
				<div className="flex flex-col space-y-16 mx-[20%] w-full">
					<div className="flex flex-row justify-between w-full mt-[2.5rem]">
						<div>
							<h2 className="font-bold text-[26px]">{teamName}</h2>
							<h3 className="font-semibold text-[#777777] text-[15px]">Team members ({owners?.length})</h3>
							<h3 className="font-semibold text-[#777777] text-[15px]">Contracts deployed (0)</h3>
						</div>
						<div className="flex flex-col space-y-1 w-[205px]">
							<div className="flex flex-row space-x-4">
								<div className="font-bold text-[26px]">{balance}</div>
								<div className="mt-1">
									{/* BUTTON */}
									<button
										onClick={() => setToggleAddFunds(!toggleAddFunds)}
										className={`flex flex-row items-center rounded-xl font-semibold bg-[#3574f4] text-[10px] text-white drop-shadow-lg px-[23px] py-[8px] 
									${toggleAddFunds ? "opacity-90" : ""}`}
									>
										{!toggleAddFunds ? <PlusIcon className="h-4" /> : <MinusIcon className="h-4" />}
										{!toggleAddFunds ? "Add funds" : "Cancel"}
									</button>
								</div>
							</div>
							{toggleAddFunds && (
								<div className="flex flex-row space-x-1">
									<input
										type="number"
										className="font-semibold text-[#777777] text-[15px] bg-[#E5E6EC] border-[#777777] border-[1px] rounded-xl py-2 px-2 w-[60%]"
										onChange={(event) => setAmountToAdd(parseFloat(event.target.value) * 1e18)}
									/>
									<button
										onClick={() => sendAddToSafe()}
										className="flex flex-row items-center rounded-xl font-semibold bg-[#3574f4] text-[14px] text-white drop-shadow-lg px-[23px] py-[8px]"
									>
										<CheckIcon className="h-6" />
									</button>
								</div>
							)}
						</div>
					</div>

					{/* DEPLOY CONTRACT MODULE */}
					{writeSuccess ? 
					<div className="flex flex-col items-center space-y-[3.75rem]">
						<p className="text-2xl">Contract deployed!</p>
						<p>Transaction: <a href={`https://mumbai.polygonscan.com/tx/${data?.hash}`} target="_blank" rel="noreferrer">{data?.hash}</a></p>
					</div> : 
					
					<div className="flex flex-col items-center space-y-[3.75rem]">
			
						<div>
							<h3 className="text-[#777777] font-medium text-lg">
								Easily deploy a new contract from your team by uploading its code
							</h3>
						</div>
						<input id="fileInput" type="file" accept=".json" onChange={handleFileChange} className="hidden" />
						<label htmlFor="fileInput" className="rounded-lg border-[#000000] border-2 px-[5rem] py-[2rem]">
							{uploaded ? (
								<CheckIcon className="h-12 color-[#]" />
							) : (
								<DocumentArrowUpIcon className="h-12 color-[#]" />
							)}
						</label>
						<div>
							<button
								disabled={!uploaded}
								className="flex flex-row items-center rounded-xl font-semibold bg-[#3574f4] text-[14px] text-white drop-shadow-lg px-[23px] py-[8px] disabled:opacity-60"
								onClick={deploy}
							>
								Deploy
								<ArrowRightIcon className="h-6" />
							</button>
						</div>
					</div>}
				</div>
			</div>
		</>
	)
}
