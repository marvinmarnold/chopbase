import Header from "../../components/Header"
import { useState } from "react"
import { EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import { useAccount } from "wagmi";
import * as _ from "lodash"
import { useNavigate } from "react-router-dom";
import { useEthersSigner } from "../../hooks/useEthersSIgner";
import Safe from '@safe-global/protocol-kit/dist/src/Safe.js'

// 1.4.1 or 1.3.0
const SAFE_VERSION = '1.4.1'
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function callback(txHash) {
	console.log('Transaction hash:', txHash)
}

export default function SetUp() {
	const navigate = useNavigate();
	const [projectName, setProjectName] = useState("")
	const [safeAddress, setSafeAddress] = useState("")
	const [ethAdapter, setEthAdapter] = useState()
	const { address: adminAddress } = useAccount()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const signer = useEthersSigner()

	const handleChange = (event) => {
		setProjectName(event.target.value);
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!isSubmitting) {
			setIsSubmitting(true)
			// const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL)
			// const deployerSigner = new ethers.Wallet(import.meta.env.VITE_DEPLOYER_ADDRESS_PRIVATE_KEY, provider)
			const _ethAdapter = new EthersAdapter({
				ethers: ethers,
				signerOrProvider: signer
			})
			setEthAdapter(_ethAdapter)
			const safeFactory = await SafeFactory.create({ ethAdapter: _ethAdapter, safeVersion: SAFE_VERSION })
			const safeAccountConfig  = {
				owners: [adminAddress],
				threshold: 1,  
			}
			const saltNonce = getRandomInt(999_999_999).toString()
	
			// safe deploy
			const safe = await safeFactory.deploySafe({
				safeAccountConfig,
				saltNonce,
				callback
			})
			
			const addr = await safe.getAddress()
			setSafeAddress(addr)
			console.log('Deployed Safe:', addr)
		}
	}

	const setupSafe = async () => {
		// Create SafeFactory instance
		const safeSdk = await Safe.create({ethAdapter, safeAddress: safeAddress})
		const handlerAddress = import.meta.env.VITE_HANDLER_ADDRESS
		const safeTransaction = await safeSdk.createEnableFallbackHandlerTx(handlerAddress)
		const txResponse = await safeSdk.executeTransaction(safeTransaction)
		console.log("Executed default handler transaction")
		console.log(txResponse)

		const resp = await txResponse.transactionResponse?.wait()
		console.log("Parsed default handler response")
		console.log(resp)

		const moduleTx = await safeSdk.createEnableModuleTx(handlerAddress)
		const txResponse2 = await safeSdk.executeTransaction(moduleTx)
		console.log("Executed add module transaction")
		console.log(txResponse2)

		const resp2 = await txResponse2.transactionResponse?.wait()
		console.log("Parsed add module response")
		console.log(resp2)

		// Redirect
		const slug = _.kebabCase(projectName);
		const redirectTo = `/team/${safeAddress}/${slug}`
		console.log("Redirecting to " + redirectTo)
		navigate(redirectTo);
	}

	return <div className="text-black">
			<Header />
			{safeAddress.length > 0 ? <div className="flex mx-[20%] py-[4rem] ">
				<div className="justify-between flex flex-col w-full">
					<p className="text-3xl font-bold mb-7">Configure project for account abstraction</p>
					<button className="p-3 rounded-lg bg-cyan-700" onClick={setupSafe}>Configure</button>
				</div>
			</div> : 
			
			<div className="flex mx-[20%] py-[4rem] ">
				<div className="justify-between flex flex-col w-full">
				<p className="text-3xl font-bold mb-7">Give your project a name</p>

				<form onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-5">
						<input type="text" 
						value={projectName} 
						placeholder="Awesome Sauce" 
						onChange={handleChange}
						className="bg-white rounded-lg p-3"></input>

						<input type="submit" 
							value={isSubmitting ? "Creating project..." : "Create project"} 
							className={`rounded-lg text-white ${isSubmitting ? "bg-gray-900" : "bg-cyan-700"} p-2` }
							
							/>
					</div>
				</form>
			</div>
		</div>}
	</div>
}
