import Header from "../../../components/Header"
import { useAccount } from "wagmi"
import { PlusIcon, CodeBracketIcon } from "@heroicons/react/24/outline"
import { Link, useLocation } from "react-router-dom"

export default function Overview() {
	const account = useAccount()
	console.log(account?.address)

	// get safe address + team name from URL
	const pageLocation = useLocation()
	const safeAddress = pageLocation.pathname.split("/")[2]
	const teamName = pageLocation.pathname.split("/")[3]
	const overviewLink = `/team/${safeAddress}/${teamName}`
	const membersLink = `/team/${safeAddress}/${teamName}/members`

	// get contracts deployed (maybe count event emitted for every execution)
	// read safe balance
	// read members from safe

	// TODO: delete
	const contracts = [
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

	return (
		<>
			<Header />
			{/* MENU */}
			<div className="flex w-full flex-col space-y-0">
				<div className="flex flex-row mx-[20%] space-x-[4rem] font-medium">
					<Link to={overviewLink}>
						<button>Overview</button>
					</Link>
					<Link to={membersLink}>
						<button>Members</button>
					</Link>
					<div>
						<button className="underline underline-offset-[7px]">Contracts deployed</button>
					</div>
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
						<div className="flex flex-row space-x-4">
							<div className="font-bold text-[26px]">$5.43</div>
							<div className="mt-1">
								{/* BUTTON */}
								<button className="flex flex-row items-center rounded-xl font-semibold bg-[#3574f4] text-[10px] text-white drop-shadow-lg px-[23px] py-[8px]">
									<PlusIcon className="h-4" />
									Add funds
								</button>
							</div>
						</div>
					</div>

					{/* ADD MEMBER MODULE */}
					<div className="flex flex-col space-y-8">
						<div className="flex flex-row items-center space-x-12">
							<div>
								<h2 className="font-semibold text-black text-[26px]">Contracts deployed (3)</h2>
							</div>
						</div>
						<div className="flex flex-col space-y-4">
							{contracts.map((user, id) => (
								<div key={id} className="text-[#777777] font-semibold flex flex-row items-center space-x-4">
									<div>
										<CodeBracketIcon className="h-6" />
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
