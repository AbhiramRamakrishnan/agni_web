'use client';

import React from 'react'
import SplitText from "./splitText";
import ScrollReveal from './ScrollReveal';
import { SpotlightAnimatedCard } from './GreenSpotlightCard';

import {
  ExclamationTriangleIcon,
  CurrencyRupeeIcon,
  BugAntIcon ,
  CpuChipIcon ,
  ExclamationCircleIcon ,
  ClockIcon ,
} from '@heroicons/react/24/solid';


const cards = [
  { id: 1, title: 'Poison for Protection', desc: 'Pesticides kill more than pests—they poison food, soil, and the farmer feeding your family.', icon: ExclamationTriangleIcon },
  { id: 2, title: 'High Cost, Low Hope', desc: ' ₹50K wasted each season on sprays that fade fast—leaving crops vulnerable and farmers broke.', icon: CurrencyRupeeIcon },
  { id: 3, title: 'Kills What Keeps Soil Alive', desc: 'Chemicals destroy earthworms and microbes—killing the very soul of the soil.', icon: BugAntIcon },
  { id: 4, title: 'Small Tech, Big Failure', desc: 'Cheap gadgets fail in big fields—no AI, no coordination, just false hope in plastic shells.', icon: CpuChipIcon },
  { id: 5, title: 'Toxic Chain to Consumers', desc: ' Harmful sprays don’t stop at the farm—they reach your plate, harming health silently.', icon: ExclamationCircleIcon },
  { id: 6, title: 'Temporary Fixes, Permanent Losses', desc: 'Short-term chemical fixes ruin long-term fertility and future harvests', icon: ClockIcon },
]

const Failures = () => {
  return (
    <>
    <div className='bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-30'>
        <div className='text-center pt-16'>

            <SplitText
                text={
                    <>
                        This Is What <br /> We’re Replacing
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
        <div className='text-center mx-auto w-4/5 md:w-12/40 mt-8'>
            <ScrollReveal
                title=""
                description="He plants with hope, but harvests heartbreak—poisoned soil, broken tools, and dreams lost in silence."
            />

        </div>
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-12 lg:px-20 mt-20">
            {cards.map((card, i) => {
                const Icon = card.icon
                return (
                    <div key={card.id} className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                        <SpotlightAnimatedCard delay={i * 100}>
                        <div className="flex flex-col h-full justify-between pb-4 sm:pb-6 ">
                            <div className="flex flex-col gap-2">
                                <Icon className="w-8 h-8 text-[#1ccb70] rounded-full mb-3 mt-1 ml-1" />
                                <h3 className="text-lg font-bold leading-loose">{card.title}</h3>
                            </div>
                            <p className="text-sm text-[#3e473f] font-poppins">{card.desc}</p>
                        </div>
                        </SpotlightAnimatedCard>
                    </div>
                )
            })}
        </div>
    </div>
    </>
  )
}

export default Failures