"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Sprout, 
  TrendingUp, 
  Zap, 
  ShoppingCart 
} from 'lucide-react';

// Types
interface CardData {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  content: string[];
  color: string;
}

interface CarouselProps {
  cards: CardData[];
  autoRotateInterval?: number;
}

interface CarouselCardProps {
  card: CardData;
  isActive: boolean;
  position: 'above' | 'center' | 'below' | 'hidden';
  index: number;
  onHover?: (isHovered: boolean) => void;
  onCardInteraction?: (isInteracting: boolean) => void;
}

// Data
const carouselData: CardData[] = [
  {
    id: 'farmers',
    title: 'Farmers',
    icon: Sprout,
    color: '#16a34a',
    content: [
      '80% More Profit',
      '₹105K+ Savings',
      '60% Yield Boost',
      '95% Locust Kill Rate',
      '100% Chemical-Free',
      'Sell 35% Higher',
      'No Internet Needed',
      'AGNI App access',
      '80% Subsidy-Ready',
      'Honors Tradition',
      'Peace of Mind',
      'Multi-Gen Empowerment'
    ]
  },
  {
    id: 'investors',
    title: 'Investors',
    icon: TrendingUp,
    color: '#2563eb',
    content: [
      'High ROI — 2X growth',
      'Solves for 100M+ farmers',
      'Subsidy-Ready',
      'Low CAC, High Retention',
      'Monopoly Tech',
      'Full Ecosystem',
      'Patent Ready',
      'ESG-Aligned',
      'AI + CleanTech',
      'Scalable Nationwide',
      'Social Impact',
      'Real Farmer Stories',
      '95% Adoption',
      'Cross-Sector Use',
      'Exit-Friendly'
    ]
  },
  {
    id: 'entrepreneurs',
    title: 'Entrepreneurs',
    icon: Zap,
    color: '#dc2626',
    content: [
      'Sell Direct',
      'Franchise Ready',
      'Grow & Scale',
      'Website Builder',
      'High Profit',
      'Upskill with App',
      'Community Growth',
      'No Tech Skills',
      'Low Cost, High Return',
      'Be the Hero'
    ]
  },
  {
    id: 'customers',
    title: 'Customers',
    icon: ShoppingCart,
    color: '#7c3aed',
    content: [
      '100% Clean Food',
      'Fast Delivery',
      'QR Verified',
      'No Extra Cost',
      'Better for Planet',
      'Support Farmers',
      'Every Order = Impact'
    ]
  }
];

// CarouselCard Component
const CarouselCard: React.FC<CarouselCardProps> = ({
  card,
  isActive,
  position,
  index,
  onHover,
  onCardInteraction
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobileScrollMode, setIsMobileScrollMode] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Motion values for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(mouseX, { stiffness: 300, damping: 30 });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCardStyle = () => {
    const mobileScale = isMobile ? 0.8 : 1.0;
    const mobileYOffset = isMobile ? 80 : 120;
    
    switch (position) {
      case 'center':
        return {
          scale: mobileScale,
          y: 0,
          zIndex: 10,
          opacity: 1,
          rotateX: 0,
        };
      case 'above':
        return {
          scale: (isMobile ? 0.65 : 0.85) * mobileScale,
          y: -mobileYOffset,
          zIndex: 5,
          opacity: 0.7,
          rotateX: 15,
        };
      case 'below':
        return {
          scale: (isMobile ? 0.65 : 0.85) * mobileScale,
          y: mobileYOffset,
          zIndex: 5,
          opacity: 0.7,
          rotateX: -15,
        };
      default:
        return {
          scale: (isMobile ? 0.45 : 0.6) * mobileScale,
          y: position === 'hidden' ? (index < 2 ? -(mobileYOffset + 80) : (mobileYOffset + 80)) : 0,
          zIndex: 1,
          opacity: 0,
          rotateX: 0,
        };
    }
  };

  const cardStyle = getCardStyle();

  // Desktop mouse move handler for 3D tilt
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive || isMobile) return;
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(deltaX * 15);
    mouseY.set(-deltaY * 15);
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      mouseX.set(0);
      mouseY.set(0);
    }
    onHover?.(false);
  };

  // Mobile touch handlers for 3D tilt
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive || !isMobile) return;
    
    const touch = e.touches[0];
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (touch.clientX - centerX) / (rect.width / 2);
    const deltaY = (touch.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(deltaX * 20);
    mouseY.set(-deltaY * 20);
    
    onCardInteraction?.(true);
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      mouseX.set(0);
      mouseY.set(0);
      onCardInteraction?.(false);
    }
  };

  // Mobile tap to enter scroll mode
  const handleCardClick = () => {
    if (isMobile && isActive) {
      setIsMobileScrollMode(true);
      onCardInteraction?.(true);
    }
  };

  // Desktop scrollbar interaction
  const handleScrollbarMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    
    e.stopPropagation();
    setIsScrolling(true);
    onCardInteraction?.(true);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const scrollbar = scrollbarRef.current;
      const content = contentRef.current;
      if (!scrollbar || !content) return;
      
      const rect = scrollbar.getBoundingClientRect();
      const y = Math.max(0, Math.min(moveEvent.clientY - rect.top, rect.height));
      const percentage = y / rect.height;
      
      const maxScroll = content.scrollHeight - content.clientHeight;
      const newScrollTop = percentage * maxScroll;
      
      content.scrollTop = newScrollTop;
      setScrollPosition(percentage);
    };
    
    const handleMouseUp = () => {
      setIsScrolling(false);
      onCardInteraction?.(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Mobile scroll handling
  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isMobileScrollMode) return;
    
    const target = e.target as HTMLDivElement;
    const percentage = target.scrollTop / (target.scrollHeight - target.clientHeight);
    setScrollPosition(percentage);
  };

  // Exit mobile scroll mode
  const handleMobileScrollEnd = () => {
    if (isMobileScrollMode) {
      setIsMobileScrollMode(false);
      onCardInteraction?.(false);
    }
  };

  const maxContentHeight = card.content.length * (isMobile ? 32 : 40);
  const containerHeight = isMobile ? 128 : 192;
  const needsScrollbar = maxContentHeight > containerHeight;

  const IconComponent = card.icon;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={cardStyle}
      animate={cardStyle}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{
        perspective: '1000px',
      }}
      onHoverStart={() => onHover?.(true)}
      onHoverEnd={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        className={`
          relative w-full max-w-lg rounded-3xl p-6 cursor-pointer
          ${isMobile ? 'h-80 max-w-xs' : 'h-96 max-w-lg p-8'}
          ${isActive 
            ? 'bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 shadow-2xl' 
            : 'bg-white/10 backdrop-blur-md border border-white/20 shadow-xl'
          }
          overflow-hidden
          ${isMobileScrollMode ? 'cursor-default' : 'cursor-pointer'}
        `}
        style={{
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        whileHover={isActive && !isMobile ? {
          scale: 1.05,
        } : !isActive ? {
          scale: 0.9,
        } : {}}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        {/* Mobile scroll mode overlay */}
        {isMobileScrollMode && (
          <div 
            className="absolute inset-0 z-50 bg-black/20 rounded-3xl flex items-center justify-center"
            onClick={handleMobileScrollEnd}
          >
            <div className="text-white text-xs bg-black/50 px-3 py-1 rounded-full">
              Tap outside to exit scroll mode
            </div>
          </div>
        )}

        {/* Spotlight effect for active card */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent opacity-60" 
               style={{
                 background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)'
               }} 
          />
        )}

        {/* Glare effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)'
          }}
        />

        {/* Card Icon */}
        <div className="flex justify-center items-center mb-4">
          <div className={`
            p-3 rounded-2xl 
            ${isMobile ? 'p-2' : 'p-4'}
            ${isActive 
              ? 'bg-white/20 text-white' 
              : 'bg-gray-800/80 text-gray-200'
            }
          `}>
            <IconComponent size={isMobile ? 24 : 32} />
          </div>
        </div>

        {/* Card Title */}
        <h3 className={`
          font-bold text-center mb-4
          ${isMobile ? 'text-lg mb-3' : 'text-2xl mb-6'}
          ${isActive ? 'text-white' : 'text-gray-800'}
        `}>
          {card.title}
        </h3>

        {/* Card Content Container */}
        <div className="relative">
          {/* Scrollable Content */}
          <div 
            ref={contentRef}
            className={`
              space-y-2 overflow-y-auto scrollbar-none pr-3
              ${isMobile ? 'h-32 pr-2' : 'h-48 pr-4'}
              ${isMobileScrollMode ? 'overflow-y-scroll' : ''}
            `}
            onScroll={handleMobileScroll}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {card.content.map((item, idx) => (
              <motion.div
                key={idx}
                className={`
                  px-3 py-2 rounded-lg
                  ${isMobile ? 'text-xs px-2 py-1' : 'text-sm px-3 py-2'}
                  ${isActive 
                    ? 'bg-white/10 text-gray-100' 
                    : 'bg-gray-800/60 text-gray-700'
                  }
                `}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                • {item}
              </motion.div>
            ))}
          </div>

          {/* Custom Scrollbar for Desktop */}
          {needsScrollbar && !isMobile && isActive && (
            <div className="absolute right-0 top-0 h-48 w-2 bg-white/10 rounded-full">
              <div
                ref={scrollbarRef}
                className="relative h-full w-full cursor-pointer"
                onMouseDown={handleScrollbarMouseDown}
              >
                <motion.div
                  className={`
                    absolute right-0 w-2 bg-white/40 rounded-full cursor-grab
                    ${isScrolling ? 'cursor-grabbing bg-white/60' : ''}
                  `}
                  style={{
                    height: `${Math.max(20, (containerHeight / maxContentHeight) * 100)}%`,
                    top: `${scrollPosition * (100 - Math.max(20, (containerHeight / maxContentHeight) * 100))}%`,
                  }}
                  whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.6)' }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          )}

          {/* Mobile scroll indicator */}
          {isMobile && isActive && needsScrollbar && (
            <div className="absolute bottom-0 right-0 text-xs text-white/60 bg-black/30 px-2 py-1 rounded text-[10px]">
              Tap to scroll
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main VerticalCarousel Component
const VerticalCarousel: React.FC<CarouselProps> = ({ 
  cards, 
  autoRotateInterval = 2000 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [cardInteracting, setCardInteracting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<NodeJS.Timeout>();
  const lastScrollTime = useRef<number>(0);
  const scrollVelocity = useRef<number>(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Auto-rotation logic
  useEffect(() => {
    const startAutoRotate = () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
      
      if (!isPaused && !isHovered && !isInteracting && !cardInteracting) {
        autoRotateRef.current = setInterval(nextCard, autoRotateInterval);
      }
    };

    startAutoRotate();

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [isPaused, isHovered, isInteracting, cardInteracting, nextCard, autoRotateInterval]);

  // Enhanced scroll handling with velocity tracking
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      const timeDelta = now - lastScrollTime.current;
      lastScrollTime.current = now;
      
      scrollVelocity.current = Math.abs(e.deltaY) / Math.max(timeDelta, 1);
      
      setIsInteracting(true);
      
      if (e.deltaY > 0) {
        nextCard();
      } else {
        prevCard();
      }
      
      const delay = Math.min(1500, Math.max(800, 1000 / scrollVelocity.current));
      setTimeout(() => {
        setIsInteracting(false);
      }, delay);
    };

    const handleTouchStart = (e: TouchEvent) => {
      setIsPaused(true);
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        setIsPaused(false);
      }, 300);
    };

    const handleMouseDown = () => {
      setIsPaused(true);
    };

    const handleMouseUp = () => {
      setTimeout(() => {
        setIsPaused(false);
      }, 200);
    };

    carousel.addEventListener('wheel', handleWheel, { passive: false });
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mouseup', handleMouseUp);

    return () => {
      carousel.removeEventListener('wheel', handleWheel);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchend', handleTouchEnd);
      carousel.removeEventListener('mousedown', handleMouseDown);
      carousel.removeEventListener('mouseup', handleMouseUp);
    };
  }, [nextCard, prevCard]);

  const getCardPosition = (cardIndex: number) => {
    const diff = cardIndex - activeIndex;
    
    if (diff === 0) return 'center';
    if (diff === 1 || (diff === -(cards.length - 1))) return 'below';
    if (diff === -1 || (diff === cards.length - 1)) return 'above';
    return 'hidden';
  };

  const handleCardInteraction = (interacting: boolean) => {
    setCardInteracting(interacting);
  };

  return (
    <div className="w-full h-full flex items-center justify-center pb-32">
      <div 
        ref={carouselRef}
        className={`
          relative w-full flex items-center justify-center
          ${isMobile ? 'max-w-sm h-full' : 'max-w-2xl h-full'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ perspective: '1200px' }}
      >
        {/* Enhanced background decoration */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-100/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-conic from-purple-100/20 via-transparent to-blue-100/20" />
        
        {/* Cards container */}
        <div className={`
          relative w-full
          ${isMobile ? 'h-80' : 'h-96'}
        `}>
          <AnimatePresence mode="sync">
            {cards.map((card, index) => (
              <CarouselCard
                key={card.id}
                card={card}
                isActive={index === activeIndex}
                position={getCardPosition(index)}
                index={index}
                onHover={(hovered) => setIsHovered(hovered)}
                onCardInteraction={handleCardInteraction}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Custom Scrollbar Navigation */}
        <div className={`
          absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center
          ${isMobile ? 'bottom-4' : 'bottom-8'}
        `}>
          <div className="relative bg-white/20 backdrop-blur-md rounded-full p-2">
            <div className="flex items-center space-x-2">
              {cards.map((_, index) => (
                <motion.button
                  key={index}
                  className={`
                    rounded-full transition-all duration-500 relative overflow-hidden
                    ${isMobile ? 'h-2' : 'h-3'}
                    ${index === activeIndex 
                      ? 'bg-emerald-700 shadow-lg' 
                      : 'bg-gray-400 hover:bg-gray-600'
                    }
                  `}
                  style={{
                    width: index === activeIndex 
                      ? (isMobile ? '24px' : '32px') 
                      : (isMobile ? '8px' : '12px')
                  }}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ 
                    scale: index === activeIndex ? 1.05 : 1.2,
                    backgroundColor: index === activeIndex ? '#0f5132' : '#4b5563'
                  }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    width: index === activeIndex 
                      ? (isMobile ? '24px' : '32px') 
                      : (isMobile ? '8px' : '12px'),
                    backgroundColor: index === activeIndex ? '#15803d' : '#9ca3af'
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.4
                  }}
                >
                  {/* Active indicator glow effect */}
                  {index === activeIndex && (
                    <motion.div
                      className="absolute inset-0 bg-emerald-400/30 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export component with default data
export default function VerticalCarouselWithData() {
  return <VerticalCarousel cards={carouselData} autoRotateInterval={2000} />;
}