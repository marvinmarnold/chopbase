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

export default function Overview() {
	const [uploaded, setUploaded] = useState(false)
	const [abi, setAbi] = useState(null)

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

	const { sendTransaction: sendAddToSafe } = useSendTransaction({
		to: safeAddress,
		value: amountToAdd,
	})

	useEffect(() => {
		if (!abi) return

		// handle abi here (initiate deployment)
	}, [abi])

	const handleFileChange = (event) => {
		const file = event.target.files[0]
		if (file && file.type === "application/json") {
			const reader = new FileReader()
			reader.onload = (e) => {
				const content = JSON.parse(e.target.result)
				setAbi(content.abi)
				setUploaded(true)
			}
			reader.readAsText(file)
		} else {
			alert("Please upload a valid JSON file.")
		}
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
							<h3 className="font-semibold text-[#777777] text-[15px]">Team members ({owners.length})</h3>
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
							>
								Deploy
								<ArrowRightIcon className="h-6" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
