import Header from "../components/Header";
import ButtonMakeProject from "../components/ButtonMakeProject";
import ConnectButton from "../components/ConnectButton";

export default function Home() {
  return (
    <main className="flex flex-col justify-center h-screen">
      {/* <div className="flex justify-between w-full mb-6"> */}
      {/* <div className="text-4xl font-extrabold">Team Name</div> */}
      <div></div>
      <Header />
      {/* </div> */}
      <div className="z-10 w-full text-sm flex flex-col items-center justify-center flex-grow">
        <div className="flex flex-col items-start">
          <div className="text-4xl font-extrabold">
            Automatically deploy your Smart Contracts.
            <br />
            Gasless. Safe.
          </div>
          <div className="text-2xl">
            And you don’t have to worry about private keys
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-3">
          <ConnectButton />
          <div> </div>
        </div>
      </div>
    </main>
  );
}
