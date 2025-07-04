import React from 'react'
import CircularGallery from './whyCard'
import SplitText from './splitText'
import ScrollReveal from './ScrollReveal'

const Solutions = () => {

  
  return (
    <div className='pt-30 bg-gradient-to-br from-slate-50 via-white to-slate-100'>
    <div className='text-center h-auto'>
        <SplitText
            text={
                <>
                  Why AGNI ?
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
    <div className='w-4/5 md:w-2/5 mx-auto'>
        <ScrollReveal
            title=""
            description="Protection. Precision. Profit — all from one intelligent, eco-powered unit."
        />
    </div>
    <div>
        <div className='h-["600px"] relative sm:h-["400px"]'>
          <CircularGallery />
        </div>
        {/* <main className="w-screen h-screen bg-black">
          <CircularGallery
              bend={2}
              font="bold 32px Figtree"
              textColor="#dbfdeb"
              borderRadius={0.04}
              items={[
                { image: "https://picsum.photos/seed/1/800/600", text: "Ocean View" },
                { image: "https://picsum.photos/seed/2/800/600", text: "City Lights" },
              ]}
            />

        </main> */}
    </div>
    </div>
  )
}

export default Solutions