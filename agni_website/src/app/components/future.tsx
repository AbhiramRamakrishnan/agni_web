'use client';

import React from 'react'
import SplitText from './splitText';
import ScrollReveal from './ScrollReveal';
import FutureCard from "./future_card";


const Future = () => {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col justify-center pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          {/* <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Experience the Future Today
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Revolutionize farming with India's Smartest AI Agro-Defender & E-Commerce Platform.
            Protect Crops. Sell Harvests. Empower Farmers. Seed the Change. Rule the Game.
          </p> */}
          <div>
            <SplitText
                text={
                    <>
                        Experience the Future Today
                    </>
                }
                className="text-2xl sm:text-3xl md:4xl lg:5xl xl:text-6xl font-bold text-gray-900"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
            />
          </div>
          <div className='text-center mx-auto sm:w-4/5 mt-10 mb-10'>
            <ScrollReveal
                title=""
                description="Revolunize farming with India’s Smartest AI Agro-Defender & E-Commerce Platform. Protect Crops. Sell Harvests. Empower Farmers. Seed the Change. Rule the Game"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <FutureCard />
        </div>
      </div>
    </div>
    </div>
  )
}

export default Future
