import Header from "./../components/Header";

export default function Home() {
  return (
    <main className="font-inter flex min-h-screen flex-col items-center p-24 justify-start">
      {/* <div className="flex justify-between w-full mb-6"> */}
      {/* <div className="text-4xl font-extrabold">Team Name</div> */}
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
      </div>
    </main>
  );
}
