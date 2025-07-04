'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';

export default function SmartFluidSplashButton() {
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isCenter, setIsCenter] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const animationRef = useRef<number>(null);

  // Smooth splash following animation
  useEffect(() => {
    const follow = () => {
      setCurrentPos(prev => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        return {
          x: prev.x + dx * 0.2,
          y: prev.y + dy * 0.2,
        };
      });
      animationRef.current = requestAnimationFrame(follow);
    };

    if (isHovering) {
      animationRef.current = requestAnimationFrame(follow);
    } else {
      cancelAnimationFrame(animationRef.current!);
    }

    return () => cancelAnimationFrame(animationRef.current!);
  }, [isHovering, targetPos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTargetPos({ x, y });

    // Detect if cursor is over the text span
    const textElement = button.querySelector('span[data-text]');
    if (textElement) {
      const textRect = (textElement as HTMLElement).getBoundingClientRect();
      const insideText =
        e.clientX >= textRect.left &&
        e.clientX <= textRect.right &&
        e.clientY >= textRect.top &&
        e.clientY <= textRect.bottom;
      setIsCenter(insideText);
    }
  };

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsCenter(false);
  };

  const smallSize = 20;
  const buttonRect = buttonRef.current?.getBoundingClientRect();
  const fullSize = buttonRect
    ? Math.max(buttonRect.width, buttonRect.height) + 50
    : 100;

  const radius = isCenter ? fullSize / 2 : smallSize / 2;

  return (
    <Link
      href="/get-started"
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="relative inline-block px-6 py-3 rounded-md text-sm font-semibold overflow-hidden bg-black"
    >
      {/* Splash element */}
      {isHovering && (
        <span
          className="absolute rounded-full bg-white pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: currentPos.y - radius,
            left: currentPos.x - radius,
            width: isCenter ? fullSize : smallSize,
            height: isCenter ? fullSize : smallSize,
            zIndex: 0,
          }}
        />
      )}

      {/* Text with data attribute for hit test */}
      <span
        data-text
        className={`relative z-10 transition-colors duration-200 ${
          isCenter ? 'text-black' : 'text-white'
        }`}
      >
        Get AGNI
      </span>
    </Link>
  );
}
