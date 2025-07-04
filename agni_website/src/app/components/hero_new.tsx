// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="min-h-screen w-full bg-white">
//       {/* NAVBAR */}
//       <div className="relative flex items-start h-[70px] w-full z-10">
//         {/* Logo */}
//         <div className="h-[45px] mt-[15px] ml-[15px] z-20 flex items-center">
//           <Image
//             src="/logo.png"
//             alt="Agni Robotics"
//             width={180}
//             height={45}
//             className="h-[45px] w-auto"
//             priority
//           />
//         </div>
//         {/* Nav Buttons */}
//         <div className="flex flex-1 justify-center items-start gap-6 mt-3">
//           {[...Array(6)].map((_, idx) => (
//             <button
//               key={idx}
//               className="w-[120px] h-9 rounded-[18px] bg-gray-500 border-none cursor-pointer opacity-100 transition-colors"
//               aria-label={`Navigation ${idx + 1}`}
//             ></button>
//           ))}
//         </div>
//         {/* Register Button */}
//         <button className="bg-black text-white font-bold border-none rounded-r-[20px] rounded-tl-[20px] rounded-bl-[50%] px-7 py-2 text-[22px] mt-2 mr-3 h-[42px] flex items-center shadow-[1px_2px_0px_#fff,2px_4px_0px_#fff] z-20">
//           GET AGNI <span className="text-[26px] ml-2">↗</span>
//         </button>
//       </div>
//       {/* GREEN VIDEO AREA */}
//       <div
//         className="bg-[#08505a] rounded-[30px] mt-[-18px] mx-2 mb-3 min-h-[calc(100vh-85px)] w-[calc(100vw-16px)] z-0 relative transition-[min-height] duration-300"
//         style={{
//           clipPath:
//             "polygon(0 3.5%, 2.5% 0, 85% 0, 86% 0, 96.5% 0, 98% 3.5%, 100% 3.5%, 100% 100%, 0 100%)",
//         }}
//       ></div>
//     </div>
//   );
// }


"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Header() {
  return (
    <header
      className="relative w-screen h-[100px] bg-[#004D55] rounded-[20px] flex items-center"
      style={{
        padding: 0,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* Custom Notch Left */}
      <div className="absolute top-0 left-0 z-20 w-[40px] h-[20px] bg-white rounded-br-[10px] pointer-events-none" />
      {/* Custom Notch Right */}
      <div className="absolute top-0 right-0 z-20 w-[40px] h-[20px] bg-white rounded-bl-[10px] pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center h-full ml-6 z-10">
        <Image
          src="/Primary Logo (Improved).svg"
          alt="agni robotics"
          width={160}
          height={40}
          className="h-[40px] w-auto"
          priority
        />
      </div>

      {/* Navigation Tabs */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[20px] flex gap-4 z-10">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-[96px] h-[28px] bg-gray-500 rounded-full"
          />
        ))}
      </div>

      {/* GET AGNI Button */}
      <button
        className="absolute right-[20px] top-[14px] w-[120px] h-[36px] bg-black text-white text-sm font-medium uppercase rounded-full flex items-center justify-center gap-2 z-10"
        style={{
          letterSpacing: 1,
        }}
      >
        GET AGNI
        <ArrowUpRight size={20} strokeWidth={2.25} />
      </button>
    </header>
  );
}