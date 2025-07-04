import React from "react";

const gradients = (
  <svg height="0" width="0" viewBox="0 0 64 64" className="absolute pointer-events-none">
    <defs>
      <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="0" y1="62" x2="0" y2="2">
        <stop stopColor="#973BED" />
        <stop stopColor="#007CFF" offset="1" />
      </linearGradient>
      <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="0" y1="64" x2="0" y2="0">
        <stop stopColor="#FFC800" />
        <stop stopColor="#F0F" offset="1" />
      </linearGradient>
      <linearGradient id="d" gradientUnits="userSpaceOnUse" x1="0" y1="62" x2="0" y2="2">
        <stop stopColor="#00E0ED" />
        <stop stopColor="#00DA72" offset="1" />
      </linearGradient>
      <linearGradient id="e" gradientUnits="userSpaceOnUse" x1="0" y1="62" x2="0" y2="2">
        <stop stopColor="#FF6B6B" />
        <stop stopColor="#FFE66D" offset="1" />
      </linearGradient>
    </defs>
  </svg>
);

export const AgniLoader: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black min-h-screen" style={{ fontFamily: "sora, sans-serif",}}>
    {gradients}
    <div className="flex items-center gap-2 loader group">
      {/* Letter A */}
      <svg
        viewBox="0 0 64 64"
        height={64}
        width={64}
        className="inline-block letter-a"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={8}
          stroke="url(#b)"
          d="M12 56 L20 32 L32 8 L44 32 L52 56 M20 40 L44 40"
          className="agni-dash agni-dash-a"
          pathLength={360}
        />
      </svg>

      {/* Letter G */}
      <svg
        viewBox="0 0 64 64"
        height={64}
        width={64}
        className="inline-block letter-g"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={8}
          stroke="url(#c)"
          d="M48 20 C48 12 40 8 32 8 C20 8 12 16 12 32 C12 48 20 56 32 56 C40 56 48 52 48 44 L48 36 L36 36"
          className="agni-dash agni-spin-g"
          pathLength={360}
        />
      </svg>

      <div className="w-2" />

      {/* Letter N */}
      <svg
        viewBox="0 0 64 64"
        height={64}
        width={64}
        className="inline-block letter-n"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={8}
          stroke="url(#d)"
          d="M12 56 L12 8 L52 56 L52 8"
          className="agni-dash agni-dash-n"
          pathLength={360}
        />
      </svg>

      {/* Letter I */}
      <svg
        viewBox="0 0 64 64"
        height={64}
        width={64}
        className="inline-block letter-i"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={8}
          stroke="url(#e)"
          d="M20 8 L44 8 M32 8 L32 56 M20 56 L44 56"
          className="agni-dash agni-dash-i"
          pathLength={360}
        />
      </svg>
    </div>
    <style jsx>{`
      .agni-dash {
        stroke-dasharray: 360;
        stroke-dashoffset: 360;
        opacity: 0.8;
        animation: agniDash 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
      }
      .agni-spin-g {
        animation: agniSpinBounce 4s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        transform-origin: center;
      }
      .agni-dash-a {
        animation: agniDashPulse 3s ease-in-out infinite;
      }
      .agni-dash-n {
        animation: agniDashWave 3.5s ease-in-out infinite;
      }
      .agni-dash-i {
        animation: agniDashFlicker 2.5s ease-in-out infinite;
      }
      .loader:hover .agni-dash-a {
        animation-duration: 1.5s !important;
      }
      .loader:hover .agni-spin-g {
        animation-duration: 2s !important;
      }
      .loader:hover .agni-dash-n {
        animation-duration: 2s !important;
      }
      .loader:hover .agni-dash-i {
        animation-duration: 1.2s !important;
      }
      @keyframes agniDash {
        0%,
        100% {
          stroke-dashoffset: 360;
          opacity: 0.8;
        }
        50% {
          stroke-dashoffset: 0;
          opacity: 1;
        }
      }
      @keyframes agniDashPulse {
        0%,
        100% {
          stroke-dashoffset: 360;
          opacity: 0.6;
          transform: scale(1);
        }
        50% {
          stroke-dashoffset: 0;
          opacity: 1;
          transform: scale(1.05);
        }
      }
      @keyframes agniSpinBounce {
        0% {
          transform: rotate(0deg) scale(1);
          stroke-dashoffset: 360;
          opacity: 0.7;
        }
        25% {
          transform: rotate(90deg) scale(1.1);
          opacity: 0.9;
        }
        50% {
          transform: rotate(180deg) scale(1);
          stroke-dashoffset: 180;
          opacity: 1;
        }
        75% {
          transform: rotate(270deg) scale(1.1);
          opacity: 0.9;
        }
        100% {
          transform: rotate(360deg) scale(1);
          stroke-dashoffset: 0;
          opacity: 0.7;
        }
      }
      @keyframes agniDashWave {
        0%,
        100% {
          stroke-dashoffset: 360;
          opacity: 0.8;
          filter: hue-rotate(0deg);
        }
        33% {
          stroke-dashoffset: 240;
          opacity: 0.9;
          filter: hue-rotate(60deg);
        }
        66% {
          stroke-dashoffset: 120;
          opacity: 1;
          filter: hue-rotate(120deg);
        }
        100% {
          stroke-dashoffset: 0;
          opacity: 0.8;
          filter: hue-rotate(180deg);
        }
      }
      @keyframes agniDashFlicker {
        0%,
        100% {
          stroke-dashoffset: 360;
          opacity: 0.6;
        }
        20% {
          stroke-dashoffset: 280;
          opacity: 1;
        }
        40% {
          stroke-dashoffset: 200;
          opacity: 0.8;
        }
        60% {
          stroke-dashoffset: 120;
          opacity: 1;
        }
        80% {
          stroke-dashoffset: 40;
          opacity: 0.9;
        }
        100% {
          stroke-dashoffset: 0;
          opacity: 0.6;
        }
      }
    `}</style>
  </div>
);

export default AgniLoader;