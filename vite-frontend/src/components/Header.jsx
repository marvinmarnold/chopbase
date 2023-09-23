import ConnectButton from "./ConnectButton"

export default function Header() {
	return (
		<header>
			<div className="flex mx-[20%] py-[4rem] ">
				<div className="justify-between flex w-full">
					<div>
						<h1 className="text-[36px] font-bold text-black">TeamName</h1>
					</div>
					<div>
						<ConnectButton />
					</div>
				</div>
			</div>
		</header>
	)
}
