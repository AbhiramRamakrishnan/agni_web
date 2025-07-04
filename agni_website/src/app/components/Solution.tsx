"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Shield,
  Zap,
  Cpu,
  Puzzle,
  Leaf,
  TrendingUp,
  Store,
  Smartphone,
  Satellite,
  Dna,
} from "lucide-react";

// Inline all custom CSS as a <style jsx global> block
const customStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.bg-gradient-radial {
  background-image: radial-gradient(circle, var(--tw-gradient-stops));
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
}

.animate-fade-out-down {
  animation: fadeOutDown 0.8s ease-out forwards;
}

.animate-card-enter {
  animation: cardEnter 0.33s ease-out forwards;
}

.animate-card-exit {
  animation: cardExit 0.2s ease-out forwards;
}

.animate-aurora-slow {
  animation: aurora 8s ease-in-out infinite;
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(40px);
  }
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes cardExit {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(40px) scale(0.96);
  }
}

@keyframes aurora {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
  }
  33% {
    transform: translate(-50%, -50%) rotate(120deg) scale(1.1);
  }
  66% {
    transform: translate(-50%, -50%) rotate(240deg) scale(0.9);
  }
}

@keyframes neonPulse {
  0%, 100% {
    opacity: 0.3;
    box-shadow: 0 0 5px #b9f9d6, 0 0 10px #b9f9d6, 0 0 15px #b9f9d6;
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 10px #b9f9d6, 0 0 20px #b9f9d6, 0 0 30px #b9f9d6;
  }
}

@keyframes centralLineGlow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes typewriterBlink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

@keyframes borderGradientRotate {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Typewriter Effect */
.typewriter-text {
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.5px;
  font-weight: 400;
}

.typewriter-cursor {
  color: #004a56;
  font-weight: bold;
  animation: typewriterBlink 1s infinite;
  transition: opacity 0.1s ease;
}

/* Central Line Styling */
.central-line {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    #b9f9d6 20%,
    #b9f9d6 80%,
    transparent 100%
  );
  box-shadow: 0 0 10px #b9f9d6, 0 0 20px #b9f9d6;
  animation: centralLineGlow 3s ease-in-out infinite;
  transform: translateX(-50%);
  height: calc(var(--scroll-progress, 0) * 100%);
  transition: height 0.1s ease-out;
}

/* Neon Edge Effects */
.neon-edge {
  box-shadow: 
    0 0 5px #b9f9d6,
    0 0 10px #b9f9d6,
    0 0 15px #b9f9d6,
    0 0 20px #b9f9d6;
  animation: neonPulse 2s ease-in-out infinite;
}

.card-left .neon-edge {
  right: -2px;
  border-radius: 0 4px 4px 0;
}

.card-right .neon-edge {
  left: -2px;
  border-radius: 4px 0 0 4px;
}

/* Border Gradient Effect on Hover */
.cursor-hover-effect {
  --mouse-x: 0px;
  --mouse-y: 0px;
}

.border-gradient-effect {
  background: linear-gradient(
    45deg,
    #82f3b8,
    #44e491,
    #1ccb70,
    #0f9952,
    #82f3b8,
    #44e491,
    #1ccb70,
    #0f9952
  );
  background-size: 400% 400%;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 2px;
  border-radius: 1rem;
}

.border-gradient-effect::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: white;
  border-radius: calc(1rem - 2px);
  z-index: -1;
}

.cursor-hover-effect:hover .border-gradient-effect {
  opacity: 1;
  animation: borderGradientRotate 3s ease infinite;
}

/* GPU Acceleration */
.feature-card {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  perspective: 1000px;
}
.feature-card * {
  transform-style: preserve-3d;
}

/* Responsive Grid Adjustments */
@media (max-width: 1024px) {
  .central-line {
    display: none;
  }
  .neon-edge {
    display: none;
  }
  .border-gradient-effect {
    display: none;
  }
}
@media (max-width: 640px) {
  .feature-card {
    margin-bottom: 1.5rem;
  }
  .typewriter-text {
    font-size: 1rem;
    line-height: 1.5;
  }
}

/* Hover Performance Optimizations */
.feature-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.feature-card:hover {
  transform: translateZ(0) scale(1.02);
}
.feature-card,
.feature-card * {
  will-change: auto;
}
.feature-card:hover,
.feature-card:hover * {
  will-change: transform, opacity;
}

/* Enhanced Staggered Animation */
.feature-card:nth-child(1) { animation-delay: 0ms; }
.feature-card:nth-child(2) { animation-delay: 50ms; }
.feature-card:nth-child(3) { animation-delay: 100ms; }
.feature-card:nth-child(4) { animation-delay: 150ms; }
.feature-card:nth-child(5) { animation-delay: 200ms; }
.feature-card:nth-child(6) { animation-delay: 250ms; }
.feature-card:nth-child(7) { animation-delay: 300ms; }
.feature-card:nth-child(8) { animation-delay: 350ms; }
.feature-card:nth-child(9) { animation-delay: 400ms; }
.feature-card:nth-child(10) { animation-delay: 450ms; }

/* Center alignment for card content */
.feature-card h3,
.feature-card p {
  text-align: center;
}
.feature-card .icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
`;

const agniFeatures = [
  {
    icon: Shield,
    title: "Self-Defending Unit",
    description:
      "World's first smart farm device that defends against 97% of threats—no drones, no chemicals, no compromise.",
  },
  {
    icon: Zap,
    title: "25+ Gadget Fusion",
    description:
      "Combines 25+ patent-worthy gadgets into one modular unit, adaptable to every crop, region & season.",
  },
  {
    icon: Cpu,
    title: "Swarm-Powered AI Defense",
    description:
      "AI Swarm predicts, protects, and personalizes defenses for each farm—zero guesswork or monitoring needed.",
  },
  {
    icon: Puzzle,
    title: "Plug & Play Farming",
    description:
      "LEGO-style design lets farmers snap upgrades, switch features, and scale without any tech knowledge.",
  },
  {
    icon: Leaf,
    title: "Eco-Warrior Core",
    description:
      "Operates on sun & wind. Zero emissions. Saves soil, water & bees while replacing ₹50K+ pesticides.",
  },
  {
    icon: TrendingUp,
    title: "Upgradeable & Always-On",
    description:
      "Start small, expand anytime. AGNI grows with your budget—backed by 24/7 support & auto-defend system.",
  },
  {
    icon: Store,
    title: "Farmer-to-Founder Model",
    description:
      "Every AGNI buyer becomes a rural entrepreneur with lifetime passive income from their own micro-grid.",
  },
  {
    icon: Smartphone,
    title: "AGNI Mart + Appstore",
    description:
      "Farmers shop, sell, upgrade, and automate on a single superapp—their own Amazon, just smarter.",
  },
  {
    icon: Satellite,
    title: "ISRO-Tuned Smart Alerts",
    description:
      "Live sync with satellite data to alert, repel & protect—all before pests even touch your farm.",
  },
  {
    icon: Dna,
    title: "AGNI DNA™ Personalization",
    description:
      "Every unit adapts to local crops, weather & pests—learning your farm like a fingerprint, improving over time.",
  },
];

const taglines = [
  '"One Tap. Total Control." AGNI puts defense, data, and decisions at your fingertips—your farm, your rules, your future.',
  '"Farm the Land. Own the Brand." AGNI makes farmers founders—with profits rooted in every acre.',
  '"One Unit. Infinite Benefits." 25+ devices fused into a single, self-adapting core—nobody else gets close.',
  '"Profit Meets Planet." AGNI ends the compromise between growth and green. It\'s both.',
];

const AgniWhySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const centralLineRef = useRef<HTMLDivElement>(null);
  const [typewriterText, setTypewriterText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  useEffect(() => {
    let typewriterTimeout: NodeJS.Timeout;
    let pauseTimeout: NodeJS.Timeout;

    const startTypewriter = () => {
      let index = 0;
      const currentTagline = taglines[currentTaglineIndex];
      setTypewriterText("");

      const typeNextChar = () => {
        if (index < currentTagline.length) {
          setTypewriterText(currentTagline.slice(0, index + 1));
          index++;
          typewriterTimeout = setTimeout(typeNextChar, 50);
        } else {
          pauseTimeout = setTimeout(() => {
            setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
          }, 3000);
        }
      };

      typeNextChar();
    };

    startTypewriter();

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearTimeout(typewriterTimeout);
      clearTimeout(pauseTimeout);
      clearInterval(cursorInterval);
    };
  }, [currentTaglineIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === titleRef.current) {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-fade-in-up");
              entry.target.classList.remove("animate-fade-out-down");
            } else {
              entry.target.classList.add("animate-fade-out-down");
              entry.target.classList.remove("animate-fade-in-up");
            }
          } else {
            const cardIndex = cardsRef.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (cardIndex !== -1) {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  entry.target.classList.add("animate-card-enter");
                  entry.target.classList.remove("animate-card-exit");
                }, cardIndex * 50);
              } else {
                setTimeout(() => {
                  entry.target.classList.add("animate-card-exit");
                  entry.target.classList.remove("animate-card-enter");
                }, (cardsRef.current.length - cardIndex - 1) * 30);
              }
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    cardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    // Central line scroll animation
    const handleScroll = () => {
      if (centralLineRef.current && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(
          0,
          Math.min(
            1,
            (window.innerHeight - rect.top) /
              (window.innerHeight + rect.height)
          )
        );
        centralLineRef.current.style.setProperty(
          "--scroll-progress",
          scrollProgress.toString()
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    cardRef: HTMLDivElement
  ) => {
    const rect = cardRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.style.setProperty("--mouse-x", `${x}px`);
    cardRef.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
      {/* Inject custom CSS globally */}
      <style jsx global>{customStyles}</style>
      <section
        ref={sectionRef}
        className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Background Aurora Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#82f3b8]/3 via-[#dbfdeb]/2 to-transparent blur-3xl animate-aurora-slow"></div>
        </div>

        {/* Central Line with Neon Effect */}
        {/* <div
          ref={centralLineRef}
          className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#b9f9d6] to-transparent opacity-0 lg:opacity-100 central-line"
        ></div> */}

        {/* Section Title */}
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-10 opacity-0 transform translate-y-8 transition-all duration-1000"
          >
            Core Powers of AGNI
          </h2>
          <div className="text-xl text-[#004a56]/70 max-w-4xl mx-auto min-h-[3rem] flex items-center justify-center font-poppins">
            <span className="typewriter-text text-gray-600">
              {typewriterText}
              <span
                className={`typewriter-cursor ${
                  showCursor ? "opacity-100" : "opacity-0"
                }`}
              >
                |
              </span>
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ">
          {agniFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isLeftCard = index % 2 === 0;
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className={`group relative shadow-sm shadow-green-100 bg-white rounded-2xl p-8 border border-gray-100 opacity-0 transform transition-all duration-700 hover:scale-[1.02] feature-card cursor-hover-effect ${
                  isLeftCard ? "card-left" : "card-right"
                }`}
                style={{
                  transform: "translateY(40px) scale(0.96)",
                  opacity: 0,
                }}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              >
                {/* Animated Border Gradient on Hover */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none border-gradient-effect"></div>
                {/* Neon Edge Effect */}
                <div
                  className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#b9f9d6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 neon-edge ${
                    isLeftCard ? "right-0" : "left-0"
                  }`}
                ></div>
                {/* Reduced Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-radial from-[#82f3b8]/10 via-[#dbfdeb]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                {/* Reduced Inner Spotlight */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-radial from-[#dbfdeb]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Card Border Glow */}
                <div className="absolute inset-0 rounded-2xl border border-[#82f3b8]/0 group-hover:border-[#82f3b8]/20 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(130,243,184,0.2)]"></div>
                {/* Card Content - Centered */}
                <div className="relative z-10 text-center">
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-[#82f3b8]/10 to-[#dbfdeb]/10 group-hover:from-[#82f3b8]/15 group-hover:to-[#dbfdeb]/15 transition-all duration-500 w-fit mx-auto">
                    <Icon className="w-8 h-8 text-[#004a56] group-hover:text-[#004a56] transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#196f43] mb-4 group-hover:text-[#004a56] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-[#0f9952] leading-relaxed group-hover:text-[#004a56]/90 transition-colors duration-300 font-poppins">
                    {feature.description}
                  </p>
                </div>
                {/* Elevated Shadow */}
                <div className="absolute inset-0 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:shadow-xl"></div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AgniWhySection;




