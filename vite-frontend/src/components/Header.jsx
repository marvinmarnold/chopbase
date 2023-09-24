import ConnectButton from "./ConnectButton";

export default function Header() {
  return (
    <header className="">
      <div className="flex justify-between">
        <h1 className="text-[36px] font-bold text-black">TeamName</h1>
        <ConnectButton />
      </div>
    </header>
  );
}
