// 'use client';

// import { ArrowRight } from "lucide-react";
// import Link from 'next/link';

// const Hero = () => {
//   return (
//     <div className="m-0 p-0 relative w-full h-screen overflow-hidden">
//       {/* Background Video */}
//       <video
//         className="fixed top-0 left-0 w-full h-full object-cover scale-130 transform z-[-2]"
//         autoPlay
//         loop
//         muted
//         playsInline
//       >
//         <source src="/hero-bg-video.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       {/* Navigation Bar Gradient Overlay (matches image1) */}
//       <div
//         className="pointer-events-none fixed top-0 left-0 w-full"
//         style={{
//           height: "64px", // Adjust to your navbar height if needed
//           background:
//             "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.60) 35%, rgba(255,255,255,0.0) 75%)",
//           zIndex: 1,
//         }}
//       />

//       {/* Semi-transparent Overlay on whole video for extra fade */}
//       {/* <div className="absolute inset-0 bg-black/40 z-[-1]" /> */}

//       {/* Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
//         <h1 className="text-3xl md:text-5xl font-extrabold font-mono mb-4 w-full md:w-1/2">
//           Revolutionize. Robotize. Rise with AGNI
//         </h1>
//         <p className="text-md md:text-2xl font-medium w-full md:w-1/2 mb-6">
//           India’s First All‑in‑One Smart Agro‑Defense & E‑Commerce Platform
//         </p>
//         {/* Action Buttons */}
//         <div className="flex space-x-4">
//           <Link
//             href="/get-started"
//             className="px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-md text-sm md:text-sm font-semibold transition"
//           >
//             Get Started
//           </Link>
//           <Link
//             href="/learn-more"
//             className="px-6 flex gap-2 py-3 bg-gray-700 text-white hover:bg-gray-800 rounded-md text-sm md:text-base font-semibold transition"
//           >
//             Learn More
//             <ArrowRight className="w-4 h-4 text-white mt-1" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

// 'use client';

// import { ArrowRight } from "lucide-react";
// import Link from 'next/link';

// const Hero = () => {
//   return (
//     <div className="m-0 p-0 relative w-full h-screen overflow-hidden">
//       {/* Background Video */}
//       <video
//         className="fixed top-0 left-0 w-full h-full object-cover scale-130 transform z-[-2]"
//         autoPlay
//         loop
//         muted
//         playsInline
//       >
//         <source src="/hero-bg-video.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       {/* Edge-to-center radial dark gradient overlay */}
//       <div
//         className="pointer-events-none fixed inset-0 w-full h-full z-0"
//         style={{
//           background:
//             "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
//         }}
//       />

//       {/* Navigation Bar Gradient Overlay (matches image1) */}
//       <div
//         className="pointer-events-none fixed top-0 left-0 w-full"
//         style={{
//           height: "64px", // Adjust to your navbar height if needed
//           background:
//             "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.60) 35%, rgba(255,255,255,0.0) 75%)",
//           zIndex: 1,
//         }}
//       />
//       <div className="absolute inset-0 bg-black/40 z-[-1]" />

//       {/* Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
//         <h1 className="text-3xl md:text-5xl font-extrabold font-mono mb-4 w-full md:w-1/2">
//           Revolutionize. Robotize. Rise with AGNI
//         </h1>
//         <p className="text-md md:text-2xl font-medium w-full md:w-1/2 mb-6">
//           India’s First All‑in‑One Smart Agro‑Defense & E‑Commerce Platform
//         </p>
//         {/* Action Buttons */}
//         <div className="flex space-x-4">
//           <Link
//             href="/get-started"
//             className="px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-md text-sm md:text-sm font-semibold transition"
//           >
//             Get Started
//           </Link>
//           <Link
//             href="/learn-more"
//             className="px-6 flex gap-2 py-3 bg-gray-700 text-white hover:bg-gray-800 rounded-md text-sm md:text-base font-semibold transition"
//           >
//             Learn More
//             <ArrowRight className="w-4 h-4 text-white mt-1" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

'use client';

import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import SplashBtn from './splashHero_btn'

const Hero = () => {
  return (
    <div className="m-0 p-0 relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover scale-130 transform z-[-2]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/hero-bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Edge-to-center radial dark gradient overlay (absolute, only covers Hero) */}
      <div
        className="pointer-events-none absolute inset-0 w-full h-full z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Navigation Bar Gradient Overlay (absolute, only covers Hero) */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-full"
        style={{
          height: "64px", // Adjust to your navbar height if needed
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.60) 35%, rgba(255,255,255,0.0) 75%)",
          zIndex: 1,
        }}
      />

      {/* Subtle black overlay for extra contrast */}
      <div className="absolute inset-0 bg-black/40 z-[-1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold font-mono mb-4 w-full md:w-1/2">
          Revolutionize. Robotize. <br /> <span className="text-3xl md:text-5xl">Rise with AGNI</span>
        </h1>
        <p className="text-xs md:text-sm font-medium w-full md:w-1/2 mb-6">
          India’s First All‑in‑One Smart Agro‑Defense & E‑Commerce Platform
        </p>
        {/* Action Buttons */}
        <div className="flex space-x-4">
          <SplashBtn />
          <Link
            href="/learn-more"
            className="px-6 flex gap-2 py-3 bg-[#128348] text-white hover:bg-[#14673c] rounded-md text-sm md:text-base font-semibold transition"
          >
            Learn More
            <ArrowRight className="w-4 h-4 text-white mt-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;