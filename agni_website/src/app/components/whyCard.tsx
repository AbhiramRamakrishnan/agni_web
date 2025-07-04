
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy, Crown, Cpu, ShieldCheck, Smartphone, ShoppingCart, Briefcase, Globe } from 'lucide-react';
import { cn } from './utils';

interface CardData {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  textColor: string;
}

const cardsData: CardData[] = [
  {
    id: 1,
    title: "First of Its Kind",
    description: "No drones. No gimmicks. AGNI is the first self-defending farm unit in history.",
    icon: Trophy,
    bgColor: "#0f9952",
    textColor: "white"
  },
  {
    id: 2,
    title: "Monopoly Machine",
    description: "Zero competitors. Patentable tech stack. Mini subscription empire.",
    icon: Crown,
    bgColor: "#2e7377",
    textColor: "white"
  },
  {
    id: 3,
    title: "Predictive AI System",
    description: "Works day and night, rain or shine — no labor, no guesswork, less power.",
    icon: Cpu,
    bgColor: "#0f9952",
    textColor: "white"
  },
  {
    id: 4,
    title: "Multi-Threat Killer",
    description: "Neutralizes locusts, pests, wild animals, fungi & disease — no chemicals.",
    icon: ShieldCheck,
    bgColor: "#2e7377",
    textColor: "white"
  },
  {
    id: 5,
    title: "Farmer SuperApp Ecosystem",
    description: "E-commerce. Upgrades. Buyers. Alerts. Subsidies — all in one tap.",
    icon: Smartphone,
    bgColor: "#0f9952",
    textColor: "white"
  },
  {
    id: 6,
    title: "Agri E-Commerce Hub",
    description: "Farmers get tools, sensors, and sell produce — like Amazon for farming.",
    icon: ShoppingCart,
    bgColor: "#2e7377",
    textColor: "white"
  },
  {
    id: 7,
    title: "Rural Business Builder",
    description: "Empowers farmers as entrepreneurs — sell, earn, access micro-loans.",
    icon: Briefcase,
    bgColor: "#0f9952",
    textColor: "white"
  },
  {
    id: 8,
    title: "Built for Bharat. Built for World",
    description: "Modular, rugged, subsidy-ready. Expandable to Asia, Africa & beyond.",
    icon: Globe,
    bgColor: "#2e7377",
    textColor: "white"
  }
];

export default function ThreeDCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % cardsData.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + cardsData.length) % cardsData.length);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Touch handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Wheel handling for desktop
  const handleWheel = (e: React.WheelEvent) => {
    // e.preventDefault();
    const delta = e.deltaY;
    if (Math.abs(delta) > 5) {
      if (delta > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      z: -200,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      z: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      z: -200,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const currentCard = cardsData[currentIndex];
  const IconComponent = currentCard.icon;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        isMobile ? "h-[420px] min-h-[0]" : "h-screen"
      )}
    >
      {/* Backdrop glow */}
      <div 
        className="absolute inset-0 opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, ${currentCard.bgColor === 'white' ? '#2e7377' : '#ffffff'}40, transparent 70%)`
        }}
      />

      {/* Main carousel container */}
      <div
        ref={containerRef}
        className={cn(
          "flex items-center justify-center w-full h-full px-4 md:px-8",
          isMobile && "py-0"
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
        style={{ perspective: '1000px' }}
      >
        {/* Navigation arrows - Desktop only */}
        {!isMobile && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-extrabold text-[#0f9952] hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <ChevronLeft size={40} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-extrabold text-[#0f9952] hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <ChevronRight size={40} />
            </button>
          </>
        )}

        {/* Card container */}
        <div
          className={cn(
            "relative w-full max-w-4xl aspect-video",
            isMobile && "max-w-md" // limit card width on mobile, but keep aspect ratio
          )}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
              style={{
                transformStyle: 'preserve-3d',
                rotateX: isHovered ? rotateX : 0,
                rotateY: isHovered ? rotateY : 0,
              }}
              onMouseEnter={() => setIsHovered(true)}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <div
                className={cn(
                  "relative w-full h-full rounded-3xl overflow-hidden",
                  "shadow-[0_30px_60px_rgba(0,0,0,0.12)]",
                  "backdrop-blur-sm border border-white/10"
                )}
                style={{
                  backgroundColor: currentCard.bgColor,
                  color: currentCard.textColor,
                }}
              >
                {/* Glare effect on hover */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.3), transparent 70%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Glass morphism overlay */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: `linear-gradient(135deg, ${currentCard.textColor}20, transparent 50%, ${currentCard.textColor}10)`
                  }}
                />

                {/* Card content */}
                <div className={cn(
                  "relative z-10 flex flex-col items-center justify-center h-full p-8 md:p-12 text-center",
                  isMobile && "p-4"
                )}>
                  <motion.div
                    className="mb-6 md:mb-8"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                  >
                    <IconComponent 
                      size={48} 
                      className={cn(
                        "transition-colors duration-300",
                        currentCard.bgColor === 'white' ? 'text-[#2e7377]' : 'text-white'
                      )}
                    />
                  </motion.div>
                  
                  <motion.h2
                    className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 tracking-tight"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {currentCard.title}
                  </motion.h2>
                  
                  <motion.p
                    className="text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl opacity-80"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    {currentCard.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4">
        <div className="flex space-x-2">
          {cardsData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={cn(
                "transition-all duration-300 rounded-full",
                index === currentIndex
                  ? "w-8 h-2 bg-[#0f9952]"
                  : "w-2 h-2 bg-black/30 hover:bg-black/50"
              )}
            />
          ))}
        </div>
        
        <p className="text-gray-400 text-xs">
          Swipe to explore more
        </p>
      </div>
    </div>
  );
}

