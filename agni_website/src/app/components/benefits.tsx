import React from 'react'
import VerticalCarouselCard from './VerticalCarouselCard'
import { div } from 'framer-motion/client'
import SplitText from './splitText'
import ScrollReveal from './ScrollReveal'
const Benefits = () => {
  return (
    <div className='bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20'>
      <div className='text-center'>
        <SplitText
                text={
                    <>
                        What does AGNI benefits you?
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
      <div className='w-4/5 md:w-8/17 mx-auto'>
        <ScrollReveal
            title=""
            description="What others promise, we deliver—real protection, real savings, and real healing. AGNI isn’t just better, it’s built for you—your soil, your legacy, your tomorrow."
        />
      </div>

      <div className='pt-32'>
        <VerticalCarouselCard />
      </div>
    </div>

    
  )
}

export default Benefits