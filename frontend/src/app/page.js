import Image from "next/image";

// this is the default / root
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full justify-between font-inter text-sm flex-grow lg:flex-col">
        <div className="justify-between lg:flex">
          <div>Team Name</div>
          <button>Connect</button>
        </div>
        <div>
          <div className="flex flex-col items-center">
            Automatically deploy your Smart Contracts.
            <br />
            Gasless. Safe.
          </div>
          <div>And you don’t have to worry about private keys</div>
          <div>ccc</div>
        </div>
      </div>
    </main>
  );
}
