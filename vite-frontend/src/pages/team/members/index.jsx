import Header from "../../../components/Header"
import { useEffect, useState } from "react"
import { useBalance, useSendTransaction } from "wagmi"
import { PlusIcon, UserIcon, CheckIcon, MinusIcon } from "@heroicons/react/24/outline"
import { Link, useLocation } from "react-router-dom"
import useGetOwnersOfSafe from "../../../hooks/useGetOwnersOfSafe"

export default function Overview() {
	const [balance, setBalance] = useState(0)
	const [toggleAddFunds, setToggleAddFunds] = useState(false)
	const [amountToAdd, setAmountToAdd] = useState(0)

	const [toggleAddMember, setToggleAddMember] = useState(false)
	const [memberToAdd, setMemberToAdd] = useState("")
	console.log(memberToAdd)

	// get safe address + team name from URL
	const pageLocation = useLocation()
	const safeAddress = pageLocation.pathname.split("/")[2]
	const teamName = pageLocation.pathname.split("/")[3]
	const overviewLink = `/team/${safeAddress}/${teamName}`
	const contractsLink = `/team/${safeAddress}/${teamName}/contracts`

	// get contracts deployed (maybe count event emitted for every execution)

	// read safe balance
	const balanceFetched = useBalance({ address: safeAddress })
	useEffect(() => {
		setBalance(parseFloat(balanceFetched.data.formatted).toFixed(3))
	}, [balanceFetched])

	// read members from safe
	const owners = useGetOwnersOfSafe(safeAddress)

	const { sendTransaction: sendAddToSafe } = useSendTransaction({
		to: safeAddress,
		value: amountToAdd,
	})

	// const {write: sendAddMember} = useContractWrite({
	// 	address: safeAddress,
	// 	abi: [],
	// 	functionName: "addOwner",
	// })

	const initiateAddMember = () => {
		// compose tx
		// compose signature
		// send TX
	}

	return (
		<>
			<Header />
			{/* MENU */}
			<div className="flex w-full flex-col space-y-0">
				<div className="flex flex-row mx-[20%] space-x-[4rem] font-medium">
					<Link to={overviewLink}>
						<button>Overview</button>
					</Link>
					<div>
						<button className="underline underline-offset-[7px]">Members</button>
					</div>
					<Link to={contractsLink}>
						<button>Contracts deployed</button>
					</Link>
				</div>
				<div className="bg-[#CECFD6] h-[1px] w-full">&nbsp; </div>
			</div>
			{/* MAIN content */}
			<div className="flex w-full h-screen bg-[#E5E6EC]">
				{/* STATS */}
				<div className="flex flex-col space-y-32 mx-[20%] w-full">
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

					{/* ADD MEMBER MODULE */}
					<div className="flex flex-col space-y-8">
						<div className="flex flex-row items-center space-x-12">
							<div>
								<h2 className="font-semibold text-black text-[26px]">Team members ({owners.length})</h2>
							</div>
							<div>
								<button
									className={`flex flex-row items-center rounded-xl font-semibold bg-[#3574f4] text-[10px] text-white drop-shadow-lg px-[23px] py-[8px]
									${toggleAddMember ? "opacity-90" : ""}`}
									onClick={() => setToggleAddMember(!toggleAddMember)}
								>
									{!toggleAddMember ? <PlusIcon className="h-4" /> : <MinusIcon className="h-4" />}
									{!toggleAddMember ? "Add member" : "Cancel"}
								</button>
							</div>
						</div>
						<div className="flex flex-col space-y-4">
							{owners.map((owner, id) => (
								<div key={id} className="text-[#777777] font-semibold flex flex-row items-center space-x-4">
									<div>
										<UserIcon className="h-6" />
									</div>
									<div>{owner}</div>
								</div>
							))}
							{toggleAddMember && (
								<div className="flex flex-row space-x-1">
									<input
										type="text"
										className="font-semibold text-[#777777] text-[15px] bg-[#E5E6EC] border-[#777777] border-[1px] rounded-xl py-1 px-2 w-[60%]"
										onChange={(event) => setMemberToAdd(event.target.value)}
									/>
									<button
										onClick={() => initiateAddMember()}
										className="flex flex-row items-center rounded-xl font-semibold bg-[#3574f4] text-[14px] text-white drop-shadow-lg px-[15px] py-[4px]"
									>
										<CheckIcon className="h-6" />
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
