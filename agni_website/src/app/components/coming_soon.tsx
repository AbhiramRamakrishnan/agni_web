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
        <p className="text-2xl md:text-4xl font-medium w-full md:w-1/2 mt-20 mb-6 text-[#00a064]">
          Stay <span className="bg-[#00a064] text-white p-2 rounded-xl text-xl md:text-3xl">Tuned</span> 
        </p>
      </div>
    </div>
  );
};

export default Hero;