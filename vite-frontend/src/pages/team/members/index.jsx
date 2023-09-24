import Header from "../../../components/Header"
import { useState } from "react"
import { useAccount } from "wagmi"
import { PlusIcon, UserIcon, CheckIcon, MinusIcon } from "@heroicons/react/24/outline"
import { Link, useLocation } from "react-router-dom"

export default function Overview() {
	const [toggleAddFunds, setToggleAddFunds] = useState(false)
	const account = useAccount()
	console.log(account?.address)

	// get safe address + team name from URL
	const pageLocation = useLocation()
	const safeAddress = pageLocation.pathname.split("/")[2]
	const teamName = pageLocation.pathname.split("/")[3]
	const overviewLink = `/team/${safeAddress}/${teamName}`
	const contractsLink = `/team/${safeAddress}/${teamName}/contracts`

	// get contracts deployed (maybe count event emitted for every execution)
	// read safe balance
	// read members from safe

	// TODO: delete
	const users = [
		{
			address: "0x123124124...123",
		},
		{
			address: "0x123124124...123",
		},
		{
			address: "0x123124124...123",
		},
	]

	// submit new member to safe
	const toggleAddNewMember = () => {
		// TODO: implement
	}

	// submit new deposit to safe
	const handleNewDeposit = () => {
		// TODO: implement
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
							<h3 className="font-semibold text-[#777777] text-[15px]">Team members (0)</h3>
							<h3 className="font-semibold text-[#777777] text-[15px]">Contracts deployed (0)</h3>
						</div>
						<div className="flex flex-col space-y-1 w-[205px]">
							<div className="flex flex-row space-x-4">
								<div className="font-bold text-[26px]">$5.43</div>
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
										className="font-semibold text-[#777777] text-[15px] bg-[#E5E6EC] border-[#777777] border-2 rounded-xl py-2 px-2 w-[60%]"
									/>
									<button
										onClick={handleNewDeposit}
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
								<h2 className="font-semibold text-black text-[26px]">Team members (3)</h2>
							</div>
							<div>
								<button
									className="flex flex-row items-center rounded-xl font-semibold bg-[#3574f4] text-[10px] text-white drop-shadow-lg px-[23px] py-[8px]"
									onClick={toggleAddNewMember}
								>
									<PlusIcon className="h-4" />
									Add members
								</button>
							</div>
						</div>
						<div className="flex flex-col space-y-4">
							{users.map((user, id) => (
								<div key={id} className="text-[#777777] font-semibold flex flex-row items-center space-x-4">
									<div>
										<UserIcon className="h-6" />
									</div>
									<div>{user.address}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
