// 'use client';

// import Link from 'next/link';
// import { useRef, useState, useEffect } from 'react';

// export default function SmartFluidSplashButton() {
//   const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
//   const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
//   const [isHovering, setIsHovering] = useState(false);
//   const [isCenter, setIsCenter] = useState(false);
//   const buttonRef = useRef<HTMLAnchorElement>(null);
//   const animationRef = useRef<number>(null);

//   // Smooth splash following animation
//   useEffect(() => {
//     const follow = () => {
//       setCurrentPos(prev => {
//         const dx = targetPos.x - prev.x;
//         const dy = targetPos.y - prev.y;
//         return {
//           x: prev.x + dx * 0.2,
//           y: prev.y + dy * 0.2,
//         };
//       });
//       animationRef.current = requestAnimationFrame(follow);
//     };

//     if (isHovering) {
//       animationRef.current = requestAnimationFrame(follow);
//     } else {
//       cancelAnimationFrame(animationRef.current!);
//     }

//     return () => cancelAnimationFrame(animationRef.current!);
//   }, [isHovering, targetPos]);

//   const handleMouseMove = (e: React.MouseEvent) => {
//     const button = buttonRef.current;
//     if (!button) return;

//     const rect = button.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     setTargetPos({ x, y });

//     // Detect if cursor is over the text span
//     const textElement = button.querySelector('span[data-text]');
//     if (textElement) {
//       const textRect = (textElement as HTMLElement).getBoundingClientRect();
//       const insideText =
//         e.clientX >= textRect.left &&
//         e.clientX <= textRect.right &&
//         e.clientY >= textRect.top &&
//         e.clientY <= textRect.bottom;
//       setIsCenter(insideText);
//     }
//   };

//   const handleMouseEnter = () => setIsHovering(true);

//   const handleMouseLeave = () => {
//     setIsHovering(false);
//     setIsCenter(false);
//   };

//   const smallSize = 20;
//   const buttonRect = buttonRef.current?.getBoundingClientRect();
//   const fullSize = buttonRect
//     ? Math.max(buttonRect.width, buttonRect.height) + 50
//     : 100;

//   const radius = isCenter ? fullSize / 2 : smallSize / 2;

//   return (
//     <Link
//       href="/get-started"
//       ref={buttonRef}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       onMouseMove={handleMouseMove}
//       className="relative inline-block px-6 py-3 rounded-md text-sm font-semibold overflow-hidden bg-black"
//     >
//       {/* Splash element */}
//       {isHovering && (
//         <span
//           className="absolute rounded-full bg-white pointer-events-none transition-all duration-300 ease-out"
//           style={{
//             top: currentPos.y - radius,
//             left: currentPos.x - radius,
//             width: isCenter ? fullSize : smallSize,
//             height: isCenter ? fullSize : smallSize,
//             zIndex: 0,
//           }}
//         />
//       )}

//       {/* Text with data attribute for hit test */}
//       <span
//         data-text
//         className={`relative z-10 transition-colors duration-200 ${
//           isCenter ? 'text-black' : 'text-white'
//         }`}
//       >
//         Get AGNI
//       </span>
//     </Link>
//   );
// }


'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Easing } from 'framer-motion';

interface Card {
  title: string;
  description: string;
}

const cards: Card[] = [
  {
    title: 'Speed',
    description: 'Fast and efficient responses for modern needs.',
  },
  {
    title: 'Reliability',
    description: 'We prioritize uptime and accuracy.',
  },
  {
    title: 'Innovation',
    description: 'Always pushing the boundaries of technology.',
  },
];

const variants = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? 45 : -45,
    opacity: 0,
    scale: 0.8,
    z: -100,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    z: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as Easing,
    },
  },
  exit: (direction: number) => ({
    rotateY: direction < 0 ? 45 : -45,
    opacity: 0,
    scale: 0.8,
    z: -100,
  }),
};

export default function WhyCard() {
  const [[currentIndex, direction], setIndex] = useState([0, 0]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const paginate = (newDirection: number) => {
    setIndex(([prev, _]) => {
      const newIndex = (prev + newDirection + cards.length) % cards.length;
      return [newIndex, newDirection];
    });
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => paginate(1), 4000);
    return () => clearTimeout(timeoutRef.current!);
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-xl h-64 mx-auto overflow-hidden perspective">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute w-full h-full bg-white rounded-xl shadow-xl flex flex-col justify-center items-center px-6 text-center"
        >
          <h3 className="text-xl font-semibold mb-2">{cards[currentIndex].title}</h3>
          <p className="text-gray-600">{cards[currentIndex].description}</p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <button onClick={() => paginate(-1)} className="text-gray-700 hover:text-black">
          ‹
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <button onClick={() => paginate(1)} className="text-gray-700 hover:text-black">
          ›
        </button>
      </div>
    </div>
  );
}
