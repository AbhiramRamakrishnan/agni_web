import React from 'react'
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import Navbar from '../components/navbar_otherPages'
import Ballpit from '../components/ballpitSoonPages'


const page = () => {
  return (
    <div>
      <Navbar />
        <div className="relative w-full h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-4"
         style={{
          fontFamily:'sora'
         }}>
          <div className="z-10 text-center mb-6">
            <h1 className="text-4xl md:text-6xl font-extrabold font-mono mb-4 w-full mx-auto">
              Revolutionize. Robotize. <br /> <span className="text-3xl md:text-5xl">Rise with AGNI</span>
            </h1>
            <p className="text-2xl md:text-3xl font-medium w-full md:w-1/2 mb-6 mx-auto"
                style={{
                  fontFamily:'poppins'
                }}>
              Stay Tuned !
            </p>
            <Link
                href="/"
                className="px-6 mx-auto max-w-45 w-auto flex gap-2 py-3 bg-[#128348] text-white hover:bg-[#14673c] mt-10 rounded-md text-sm md:text-base font-semibold transition"
            >
              Go Home
              <ArrowRight className="w-5 h-5 text-white mt-0.7" />
            </Link>
          </div>
          <div className="absolute inset-0">
            <Ballpit className="w-full h-full" />
          </div>
        </div>
      </div>
  )
}

export default page
