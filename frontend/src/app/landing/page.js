// export default function Landing() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24">
//       {/* <div className="z-10 max-w-5xl w-full h-full font-inter justify-between text-sm lg:flex-col"> */}
//       <div className="z-10 max-w-5xl w-full h-full font-inter text-sm flex flex-col justify-between">
//         <div className="flex justify-between">
//           <div>Team Name</div>
//           <button>Connect</button>
//         </div>
//         <div className="flex-grow flex flex-col items-center justify-center ">
//           <div className="flex items-center">
//             Automatically deploy your Smart Contracts.
//             <br />
//             Gasless. Safe.
//           </div>
//           <div>And you don’t have to worry about private keys</div>
//           {/* <div>ccc</div> */}
//         </div>
//       </div>
//     </main>
//   );
// }
export default function Landing() {
  return (
    <main className="font-inter flex min-h-screen flex-col items-center p-24 justify-start">
      <div className="flex justify-between w-full mb-6">
        <div>Team Name</div>
        <button>Connect</button>
      </div>
      <div className="z-10 max-w-5xl w-full text-sm flex flex-col items-center justify-center flex-grow">
        <div>
          Automatically deploy your Smart Contracts.
          <br />
          Gasless. Safe.
        </div>
        <div>And you don’t have to worry about private keys</div>
      </div>
      {/* The rest of your code... */}
    </main>
  );
}
