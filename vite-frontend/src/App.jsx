import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react"
import { WagmiConfig } from "wagmi"
import { arbitrum, mainnet } from "wagmi/chains"
import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import TeamOverview from "./pages/team/"
import SetUp from "./pages/set-up"

// 1. Get projectId
const projectId = "dfe74e8562f98b471672c642ff618ef4"

// 2. Create wagmiConfig
const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, appName: "Web3Modal" })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

export default function App() {
	return (
		<WagmiConfig config={wagmiConfig}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/set-up" element={<SetUp />} />
				<Route path="/team/:address" element={<TeamOverview />} />
			</Routes>
			{/* <Home /> */}
		</WagmiConfig>
	)
}
