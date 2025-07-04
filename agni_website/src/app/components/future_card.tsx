import React, { useState, useRef } from 'react';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const getCardTransform = () => {
    if (!isHovered || !cardRef.current) return 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Ultra subtle tilt - increased divisor from /20 to /40 for minimal rotation
    const rotateX = (mousePosition.y - centerY) / 40;
    const rotateY = (centerX - mousePosition.x) / 40;
    
    // Reduced scale from 1.02 to 1.01 for barely noticeable lift
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const getSpotlightStyle = () => {
    if (!isHovered) return {};
    
    return {
      background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.08) 0%, transparent 70%)`,
    };
  };

  return (
    <div className="flex min-h-auto justify-center px-3 sm:px-4 md:px-6 lg:px-8">
      <div 
        ref={cardRef}
        className="w-full max-w-[320px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-out relative border border-gray-200"
        style={{ 
          transform: getCardTransform(),
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Spotlight Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
          style={{
            ...getSpotlightStyle(),
            opacity: isHovered ? 1 : 0
          }}
        />
        
        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-xl sm:rounded-2xl transition-all duration-500 ${
          isHovered 
            ? 'shadow-[0_0_40px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/15' 
            : 'shadow-2xl'
        }`} />
        
        {/* Image Container - Responsive height scaling */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] overflow-hidden bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500">
          <img 
            src="./Product_Pic.svg"
            alt="Next Generation Robot"
            className="w-full h-full object-cover object-center transition-transform duration-700"
            style={{
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              filter: isHovered ? 'brightness(1.05) contrast(1.05)' : 'brightness(1) contrast(1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
        
        {/* Content Container - Responsive padding */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-3 sm:space-y-4 lg:space-y-5 relative z-20 bg-white">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
            AGNI: Advanced Green Nurtured Intelligence
          </h2>
          {/* Smaller description text */}
          <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">
            AGNI is more than a machine—it's a promise. A shield for farmers, a voice for the voiceless, and a tribute to those who feed us. Built with purpose, it protects what truly matters—life, land, and legacy.
          </p>
          
          {/* Tech specs indicators */}
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 pt-1 sm:pt-2">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-500">Smart Protection</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span className="text-xs sm:text-sm text-gray-500">Chemical Free Defense</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span className="text-xs sm:text-sm text-gray-500">24/7 AI Monitoring</span>
            </div>
          </div>
          
          {/* CTA Button with Green Gradient */}
          <div className="pt-3 sm:pt-4 lg:pt-5">
            <button 
              className="w-full text-white font-semibold py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-lg relative overflow-hidden group text-sm sm:text-base"
              style={{
                background: 'linear-gradient(135deg, #0f9952 0%, #16a34a 100%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(15, 153, 82, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #0f9952 0%, #16a34a 100%)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <span className="relative z-10">Explore Technology</span>
            </button>
          </div>
        </div>
        
        {/* Border glow effect */}
        <div className={`absolute inset-0 rounded-xl sm:rounded-2xl transition-all duration-500 pointer-events-none ${
          isHovered 
            ? 'ring-1 ring-blue-400/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]' 
            : ''
        }`} />
      </div>
    </div>
  );
}

export default App;