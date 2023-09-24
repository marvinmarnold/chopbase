import Header from "../../components/Header"
import { useState } from "react"
import { EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import { useAccount } from "wagmi";
import * as _ from "lodash"
import { useNavigate } from "react-router-dom";
import { useEthersSigner } from "../../hooks/useEthersSIgner";

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
			const ethAdapter = new EthersAdapter({
				ethers: ethers,
				signerOrProvider: signer
			})
			const safeFactory = await SafeFactory.create({ ethAdapter, safeVersion: SAFE_VERSION })
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
			const slug = _.kebabCase(projectName);
			const redirectTo = `/team/${addr}/${slug}`
			console.log("Redirecting to " + redirectTo)
			navigate(redirectTo);
		}
	}

	return <div className="text-black">
			<Header />
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
		</div>
	</div>
}
