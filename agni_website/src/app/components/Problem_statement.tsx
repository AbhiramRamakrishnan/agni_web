
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface Slide {
  title: string;
  text: string;
  image: string;
}

const slides: Slide[] = [
  {
    title: "Locust Attacks",
    text: "Locusts destroy ₹100 Cr+ crops yearly—erasing months of sweat, hope, and harvests overnight.",
    image: "./LocusAttack_Problem.svg"
  },
  {
    title: "Wildlife Intrusion",
    text: "Boars and wild animals destroy ₹400 Cr+ worth of crops, leaving helpless farmers in tears.",
    image: "./Wildlife_Problem.svg"
  },
  {
    title: "Farming Feeds All—But Not the Farmer",
    text: "With rising joblessness, the next generation walks away—leaving behind our soil and soul.",
    image: "./Farming_Problem.svg"
  },
  {
    title: "Fields of Sorrow",
    text: "30% of farm deaths are due to pesticide poisoning—killing the farmer, his soil, and unborn generations.",
    image: "./Fields_Problem.svg"
  },
  {
    title: "Silent Infertility Crisis",
    text: "Pesticides linked to infertility, cancer, and birth defects—30 million rural lives at risk.",
    image: "./Silent_Problem.svg"
  },
  {
    title: "Invisible in the Digital Age",
    text: "No trusted app helps farmers defend crops, sell harvests, or connect with real buyers directly.",
    image: "./Invisibility_Problem.svg"
  },
  {
    title: "Voices Without a Stage",
    text: "Farmers grow great crops but can't reach markets. Middlemen steal their profits and power.",
    image: "./Voice_Problem.svg"
  },
  {
    title: "Stuck in the Past, Starved of the Future",
    text: "Manual tools can't fight modern threats. Without smart solutions, our farms—and hope—won't survive what's next.",
    image: "./Stuck_Problem.svg"
  },
  {
    title: "Unaffordable & Unsafe",
    text: "Farmers spend ₹50K per season on toxic solutions that poison food and still fail to protect.",
    image: "./Unaffordable_Problem.svg"
  },
  {
    title: "Buried Hope",
    text: "Chemicals like urea kill earthworms and microbes—robbing the soil of life, year after year.",
    image: "./Buried_Problem.svg"
  },
  {
    title: "Hope on Hold",
    text: "When crops fail, there's no real-time help—just loan sharks, losses, and despair.",
    image: "./Hope_Problem.svg"
  },
  {
    title: "The Good Food Gap",
    text: "Urban families want chemical-free food, but there's no bridge to reach real, ethical farmers.",
    image: "./GoodFood_Problem.svg"
  }
];

// Motion variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const slideVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export default function WhyThisMatters() {
  const [mobileEmblaRef, mobileEmblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 2 }
    }
  });

  const [desktopEmblaRef, desktopEmblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (desktopEmblaApi) desktopEmblaApi.scrollPrev();
  }, [desktopEmblaApi]);

  const scrollNext = useCallback(() => {
    if (desktopEmblaApi) desktopEmblaApi.scrollNext();
  }, [desktopEmblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (desktopEmblaApi) desktopEmblaApi.scrollTo(index);
    if (mobileEmblaApi) mobileEmblaApi.scrollTo(index);
  }, [desktopEmblaApi, mobileEmblaApi]);

  const onSelect = useCallback(() => {
    if (!desktopEmblaApi) return;
    setSelectedIndex(desktopEmblaApi.selectedScrollSnap());
  }, [desktopEmblaApi]);

  const onMobileSelect = useCallback(() => {
    if (!mobileEmblaApi) return;
    setSelectedIndex(mobileEmblaApi.selectedScrollSnap());
  }, [mobileEmblaApi]);

  useEffect(() => {
    if (!desktopEmblaApi) return;
    onSelect();
    desktopEmblaApi.on('select', onSelect);
    return () => desktopEmblaApi.off('select', onSelect);
  }, [desktopEmblaApi, onSelect]);

  useEffect(() => {
    if (!mobileEmblaApi) return;
    onMobileSelect();
    mobileEmblaApi.on('select', onMobileSelect);
    return () => mobileEmblaApi.off('select', onMobileSelect);
  }, [mobileEmblaApi, onMobileSelect]);

  useEffect(() => {
    if (!desktopEmblaApi || !autoplayEnabled) return;

    const interval = setInterval(() => {
      scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [desktopEmblaApi, autoplayEnabled, scrollNext]);

  const handleMouseEnter = () => setAutoplayEnabled(false);
  const handleMouseLeave = () => setAutoplayEnabled(true);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1 }}
      className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 sm:py-12 lg:py-20 sm:pb-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Why This Matters
          </motion.h2>
          <motion.div
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto min-h-[3rem] sm:min-h-[4rem] flex items-center justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <TypeAnimation
              sequence={[
                "A snapshot of the invisible crises facing Indian farmers",
                2000,
                "From soil death to digital exclusion",
                2000,
                "Stories that demand immediate attention",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="font-medium text-center"
            />
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden">
          <div className="relative">
            <div className="overflow-hidden" ref={mobileEmblaRef}>
              <motion.div
                className="flex gap-4 pb-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {slides.map((slide, index) => (
                  <motion.div
                    key={index}
                    variants={slideVariants}
                    className="flex-[0_0_280px] sm:flex-[0_0_320px] min-w-0"
                  >
                    <div className="relative group h-full">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                        <div className="relative overflow-hidden h-40 sm:h-44 flex-shrink-0">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="p-4 sm:p-5 flex-1 flex flex-col">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight">
                            {slide.title}
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed flex-1">
                            {slide.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">← Swipe to explore more stories →</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="relative max-w-7xl mx-auto">
            <div 
              className="flex items-center justify-center gap-6 xl:gap-8"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <motion.button
                onClick={scrollPrev}
                className="z-30 p-3 xl:p-4 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={24} className="text-gray-700 xl:w-7 xl:h-7" />
              </motion.button>

              <div className="overflow-hidden max-w-4xl xl:max-w-5xl" ref={desktopEmblaRef}>
                <motion.div
                  className="flex"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {slides.map((slide, index) => (
                    <motion.div
                      key={index}
                      variants={slideVariants}
                      className="flex-[0_0_100%] min-w-0 px-3 xl:px-4"
                    >
                      <div className="relative group">
                        <div className="bg-white rounded-xl xl:rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02] max-w-5xl mx-auto">
                          <div className="grid lg:grid-cols-2 gap-0">
                            <div className="relative overflow-hidden h-64 lg:h-72 xl:h-80 2xl:h-96">
                              <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-6 lg:p-8 xl:p-10 2xl:p-12 flex flex-col justify-center">
                              <h3 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-4 lg:mb-5 xl:mb-6 leading-tight">
                                {slide.title}
                              </h3>
                              <p className="text-gray-700 text-base lg:text-lg xl:text-xl leading-relaxed">
                                {slide.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.button
                onClick={scrollNext}
                className="z-30 p-3 xl:p-4 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={24} className="text-gray-700 xl:w-7 xl:h-7" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollTo(index)}
              className={clsx(
                'w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300',
                index === selectedIndex
                  ? 'bg-[#0f9952] scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <motion.div 
          className="text-center mt-8 sm:mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            These challenges demand innovative solutions. Together, we can build a sustainable future for farming.
          </p>
          <motion.button
            className="bg-[#0f9952] hover:bg-[#0d7e44] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More About Our Solutions
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
