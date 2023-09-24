import { useContractRead } from "wagmi"

const useGetOwnersOfSafe = (safeAddress) => {
	const { data } = useContractRead({
		address: safeAddress,
		abi: [
			{
				constant: true,
				inputs: [],
				name: "getOwners",
				outputs: [
					{
						name: "",
						type: "address[]",
					},
				],
				payable: false,
				stateMutability: "view",
				type: "function",
			},
		],
		functionName: "getOwners",
	})

	return data
}

export default useGetOwnersOfSafe
