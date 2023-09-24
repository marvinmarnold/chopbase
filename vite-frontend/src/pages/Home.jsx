import Header from "../components/Header";
import ConnectButton from "../components/ConnectButton";
import { useAccount } from "wagmi";
import { Link, useLocation } from "react-router-dom";

export default function Home() {
  const { address, isConnected } = useAccount();
  return (
    <main className="flex flex-col justify-center h-screen">
      <div></div>
      <Header />
      {/* </div> */}
      <div className="z-10 w-full text-sm flex flex-col items-center  flex-grow">
        <div className="flex flex-col items-start mt-[150px]">
          <h1 className="font-bold text-[40px] leading-relaxed">
            Automatically deploy your Smart Contracts.
            <br />
            Gasless. Safe.
          </h1>
          <div className="text-[#777777] text-[20px]">
            And you don’t have to worry about private keys
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-3">
          <div className="mt-[70px]">
            <ConnectButton />
          </div>
          <Link className="mt-[15px]" to={"/set-up"}>
            <button className="mt-3 flex flex-row items-center rounded-xl font-semibold bg-[#000000] text-[10px] text-white drop-shadow-lg px-[23px] py-[8px]">
              Create Project
            </button>
          </Link>
          <div>
            <button className="bg-[#3574F4] rounded-lg"></button>
          </div>
        </div>
      </div>
    </main>
  );
}
