'use client'

import React, { useEffect, useRef, useState } from 'react'

interface SpotlightAnimatedCardProps {
  children: React.ReactNode
  delay?: number
}

export const SpotlightAnimatedCard: React.FC<SpotlightAnimatedCardProps> = ({
  children,
  delay = 0,
}) => {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Scroll-based fade/slide
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (outerRef.current) observer.observe(outerRef.current)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const inner = innerRef.current
    const spotlight = spotlightRef.current
    if (!inner || !spotlight) return

    const rect = inner.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = -((y - centerY) / centerY) * 10
    const rotateY = ((x - centerX) / centerX) * 10

    inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.97)`
    spotlight.style.opacity = '1'
    spotlight.style.transform = `translate(${x - 75}px, ${y - 75}px) scale(1)`
  }

  const handleMouseLeave = () => {
    const inner = innerRef.current
    const spotlight = spotlightRef.current
    if (!inner || !spotlight) return

    inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
    spotlight.style.opacity = '0'
    spotlight.style.transform = 'scale(0.8)'
  }

  return (
    <div
      ref={outerRef}
      className={`
        transition-all duration-500 ease-out 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-[#effef6] text-[#0e2510] p-6 h-50 rounded-xl shadow-xl overflow-hidden will-change-transform font-jakarta"
      >
        {/* Spotlight */}
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute top-0 left-0 h-36 w-36 rounded-full opacity-0"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
            filter: 'blur(12px)',
            transition: 'opacity 300ms ease',
            willChange: 'transform',
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}
