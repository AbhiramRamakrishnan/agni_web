"use client";
import React, { useState, useRef } from "react";

const CARD_COUNT = 8;

const getBaseCardStyles = (isHovered: boolean, isScrolling: boolean) => ({
  transform: isHovered
    ? "translateY(-16px) scale(1.05)"
    : isScrolling
    ? "translateY(-8px) scale(1.03)"
    : "none",
  transition: isScrolling
    ? "transform 0.1s cubic-bezier(.4,2,.6,1)"
    : "transform 0.3s cubic-bezier(.4,0,.2,1)",
  willChange: "transform",
  zIndex: isHovered ? 2 : 1,
});

const Card = ({
  index,
  isHovered,
  isScrolling,
  onHover,
  onLeave,
  onInnerHover,
  onInnerLeave,
  isInnerHovered,
}: {
  index: number;
  isHovered: boolean;
  isScrolling: boolean;
  onHover: () => void;
  onLeave: () => void;
  onInnerHover: () => void;
  onInnerLeave: () => void;
  isInnerHovered: boolean;
}) => (
  <div
    className={`
      bg-white dark:bg-neutral-900 rounded-xl
      shadow-lg
      transition-all
      overflow-hidden
      relative
      flex flex-col
      group
      select-none
      cursor-pointer
      sm:h-[320px] h-[220px] md:h-[240px] lg:h-[240px] w-full
      `}
    style={getBaseCardStyles(isHovered, isScrolling && !isInnerHovered)}
    onMouseEnter={onHover}
    onMouseMove={onHover}
    onMouseLeave={onLeave}
    onWheel={onHover}
    tabIndex={0}
  >
    <div
      className="flex-1 flex items-center justify-center"
      onMouseEnter={onInnerHover}
      onMouseLeave={onInnerLeave}
      style={{
        transition: "background 0.2s",
        background: isInnerHovered ? "rgba(0,0,0,0.07)" : "transparent",
      }}
    >
      <span className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
        Card #{index + 1}
      </span>
    </div>
  </div>
);

export function UpliftingCards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [innerHoveredIndex, setInnerHoveredIndex] = useState<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScrollHover = (i: number) => {
    setHoveredIndex(i);
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 150);
  };

  return (
    <div
      className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
        max-w-5xl mx-auto py-6 px-2
        relative
      "
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {Array.from({ length: CARD_COUNT }).map((_, i) => (
        <Card
          key={i}
          index={i}
          isHovered={hoveredIndex === i && innerHoveredIndex == null}
          isScrolling={hoveredIndex === i && isScrolling}
          onHover={() => setHoveredIndex(i)}
          onLeave={() => setHoveredIndex(null)}
          onInnerHover={() => setInnerHoveredIndex(i)}
          onInnerLeave={() => setInnerHoveredIndex(null)}
          isInnerHovered={innerHoveredIndex === i}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none"
        onWheel={(e) => {
          const bounds = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - bounds.left;
          const y = e.clientY - bounds.top;
          const col = Math.floor(
            (x / bounds.width) * (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1)
          );
          const row = Math.floor(
            (y / bounds.height) *
              (window.innerWidth >= 1024
                ? 2
                : window.innerWidth >= 640
                ? 4
                : 8)
          );
          const idx =
            window.innerWidth >= 1024
              ? row * 4 + col
              : window.innerWidth >= 640
              ? row * 2 + col
              : row;
          if (idx >= 0 && idx < CARD_COUNT) handleScrollHover(idx);
        }}
        style={{ zIndex: 10 }}
      />
    </div>
  );
}