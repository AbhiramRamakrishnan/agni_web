import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealCardProps {
  title: string;
  description: string;
}

const ScrollRevealCard: React.FC<ScrollRevealCardProps> = ({ title, description }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const text = textRef.current;
    if (!card || !text) return;

    // Card fade/slide in
    gsap.fromTo(
      card,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
      }
    );

    // Split text into words for staggered reveal
    const wordElements = text.querySelectorAll<HTMLElement>(".reveal-word");
    gsap.fromTo(
      wordElements,
      { opacity: 0, y: 24, filter: "blur(5px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
        },
      }
    );
  }, []);

  // Helper to wrap each word in a span for animation
  const renderWords = (text: string) => {
    return text.split(/(\s+)/).map((word, i) =>
      /^\s+$/.test(word) ? word : (
        <span
          className="reveal-word inline-block will-change-transform will-change-opacity"
          key={i}
        >
          {word}
        </span>
      )
    );
  };

  return (
    <div
      ref={cardRef}
      className="w-full transition-all duration-700 text-center "
    >
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <p
        ref={textRef}
        className="text-gray-600 dark:text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-relaxed mx-auto"
        style={{
          fontFamily: "poppins, sans-serif",
          fontWeight: 500,
        }}
      >
        {renderWords(description)}
      </p>
    </div>
  );
};

export default ScrollRevealCard;