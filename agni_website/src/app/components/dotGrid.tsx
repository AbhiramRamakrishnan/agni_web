// 'use client';
// import React, { useRef, useEffect, useCallback, useMemo } from "react";
// import { gsap } from "gsap";
// import { InertiaPlugin } from "gsap/InertiaPlugin";

// gsap.registerPlugin(InertiaPlugin);

// const throttle = (func: (...args: any[]) => void, limit: number) => {
//   let lastCall = 0;
//   return function (this: any, ...args: any[]) {
//     const now = performance.now();
//     if (now - lastCall >= limit) {
//       lastCall = now;
//       func.apply(this, args);
//     }
//   };
// };

// interface Dot {
//   cx: number;
//   cy: number;
//   xOffset: number;
//   yOffset: number;
//   _inertiaApplied: boolean;
// }

// export interface DotGridProps {
//   dotSize?: number;
//   gap?: number;
//   baseColor?: string;
//   activeColor?: string;
//   proximity?: number;
//   speedTrigger?: number;
//   shockRadius?: number;
//   shockStrength?: number;
//   maxSpeed?: number;
//   resistance?: number;
//   returnDuration?: number;
//   className?: string;
//   style?: React.CSSProperties;
// }

// function hslToRgb(h: number, s: number, l: number) {
//   let r, g, b;
//   if (s === 0) {
//     r = g = b = l;
//   } else {
//     const hue2rgb = (p: number, q: number, t: number) => {
//       if (t < 0) t += 1;
//       if (t > 1) t -= 1;
//       if (t < 1 / 6) return p + (q - p) * 6 * t;
//       if (t < 1 / 2) return q;
//       if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
//       return p;
//     };
//     const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//     const p = 2 * l - q;
//     r = hue2rgb(p, q, h + 1 / 3);
//     g = hue2rgb(p, q, h);
//     b = hue2rgb(p, q, h - 1 / 3);
//   }
//   return {
//     r: Math.round(r * 255),
//     g: Math.round(g * 255),
//     b: Math.round(b * 255),
//   };
// }

// function parseHSL(str: string) {
//   const m = str.match(/^hsl\(\s*([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)$/i);
//   if (!m) return undefined;
//   const h = (parseFloat(m[1]) % 360) / 360;
//   const s = parseFloat(m[2]) / 100;
//   const l = parseFloat(m[3]) / 100;
//   return hslToRgb(h, s, l);
// }

// function colorToRgb(color: string) {
//   if (color.startsWith("#")) {
//     const m = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
//     if (!m) return { r: 0, g: 0, b: 0 };
//     return {
//       r: parseInt(m[1], 16),
//       g: parseInt(m[2], 16),
//       b: parseInt(m[3], 16),
//     };
//   }
//   if (color.startsWith("hsl")) {
//     return parseHSL(color) || { r: 0, g: 0, b: 0 };
//   }
//   return { r: 0, g: 0, b: 0 };
// }

// const DotGrid: React.FC<DotGridProps> = ({
//   dotSize = 5,
//   gap = 15,
//   baseColor = "hsl(147,84%,85%)",
//   activeColor = "hsl(149,100%,45%)",
//   proximity = 120,
//   speedTrigger = 100,
//   shockRadius = 250,
//   shockStrength = 5,
//   maxSpeed = 5000,
//   resistance = 750,
//   returnDuration = 1.5,
//   className = "",
//   style,
// }) => {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const dotsRef = useRef<Dot[]>([]);
//   const pointerRef = useRef({
//     x: 0,
//     y: 0,
//     vx: 0,
//     vy: 0,
//     speed: 0,
//     lastTime: 0,
//     lastX: 0,
//     lastY: 0,
//   });

//   const baseRgb = useMemo(() => colorToRgb(baseColor), [baseColor]);
//   const activeRgb = useMemo(() => colorToRgb(activeColor), [activeColor]);

//   const circlePath = useMemo(() => {
//     if (typeof window === "undefined" || !window.Path2D) return null;
//     const p = new Path2D();
//     p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
//     return p;
//   }, [dotSize]);

//   const buildGrid = useCallback(() => {
//     const wrap = wrapperRef.current;
//     const canvas = canvasRef.current;
//     if (!wrap || !canvas) return;

//     const { width, height } = wrap.getBoundingClientRect();
//     const dpr = window.devicePixelRatio || 1;

//     canvas.width = width * dpr;
//     canvas.height = height * dpr;
//     canvas.style.width = `${width}px`;
//     canvas.style.height = `${height}px`;
//     const ctx = canvas.getContext("2d");
//     if (ctx) ctx.scale(dpr, dpr);

//     const cols = Math.floor((width + gap) / (dotSize + gap));
//     const rows = Math.floor((height + gap) / (dotSize + gap));
//     const cell = dotSize + gap;

//     const gridW = cell * cols - gap;
//     const gridH = cell * rows - gap;

//     const extraX = width - gridW;
//     const extraY = height - gridH;

//     const startX = extraX / 2 + dotSize / 2;
//     const startY = extraY / 2 + dotSize / 2;

//     const dots: Dot[] = [];
//     for (let y = 0; y < rows; y++) {
//       for (let x = 0; x < cols; x++) {
//         const cx = startX + x * cell;
//         const cy = startY + y * cell;
//         dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
//       }
//     }
//     dotsRef.current = dots;
//   }, [dotSize, gap]);

//   useEffect(() => {
//     if (!circlePath) return;

//     let rafId: number;
//     const proxSq = proximity * proximity;

//     const draw = () => {
//       const canvas = canvasRef.current;
//       if (!canvas) return;
//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const { x: px, y: py } = pointerRef.current;

//       for (const dot of dotsRef.current) {
//         const ox = dot.cx + dot.xOffset;
//         const oy = dot.cy + dot.yOffset;
//         const dx = dot.cx - px;
//         const dy = dot.cy - py;
//         const dsq = dx * dx + dy * dy;

//         let style = baseColor;
//         if (dsq <= proxSq) {
//           const dist = Math.sqrt(dsq);
//           const t = 1 - dist / proximity;
//           const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
//           const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
//           const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
//           style = `rgb(${r},${g},${b})`;
//         }

//         ctx.save();
//         ctx.translate(ox, oy);
//         ctx.fillStyle = style;
//         ctx.fill(circlePath!);
//         ctx.restore();
//       }

//       rafId = requestAnimationFrame(draw);
//     };

//     draw();
//     return () => cancelAnimationFrame(rafId);
//   }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

//   useEffect(() => {
//     buildGrid();
//     let ro: ResizeObserver | null = null;
//     if ("ResizeObserver" in window) {
//       ro = new ResizeObserver(buildGrid);
//       wrapperRef.current && ro.observe(wrapperRef.current);
//     } else {
//       (window as Window).addEventListener("resize", buildGrid);
//     }
//     return () => {
//       if (ro) ro.disconnect();
//       else window.removeEventListener("resize", buildGrid);
//     };
//   }, [buildGrid]);

//   useEffect(() => {
//     const onMove = (e: MouseEvent) => {
//       const now = performance.now();
//       const pr = pointerRef.current;
//       const dt = pr.lastTime ? now - pr.lastTime : 16;
//       const dx = e.clientX - pr.lastX;
//       const dy = e.clientY - pr.lastY;
//       let vx = (dx / dt) * 1000;
//       let vy = (dy / dt) * 1000;
//       let speed = Math.hypot(vx, vy);
//       if (speed > maxSpeed) {
//         const scale = maxSpeed / speed;
//         vx *= scale;
//         vy *= scale;
//         speed = maxSpeed;
//       }
//       pr.lastTime = now;
//       pr.lastX = e.clientX;
//       pr.lastY = e.clientY;
//       pr.vx = vx;
//       pr.vy = vy;
//       pr.speed = speed;

//       const rect = canvasRef.current!.getBoundingClientRect();
//       pr.x = e.clientX - rect.left;
//       pr.y = e.clientY - rect.top;

//       for (const dot of dotsRef.current) {
//         const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
//         if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
//           dot._inertiaApplied = true;
//           gsap.killTweensOf(dot);
//           const pushX = dot.cx - pr.x + vx * 0.005;
//           const pushY = dot.cy - pr.y + vy * 0.005;
//           gsap.to(dot, {
//             inertia: { xOffset: pushX, yOffset: pushY, resistance },
//             onComplete: () => {
//               gsap.to(dot, {
//                 xOffset: 0,
//                 yOffset: 0,
//                 duration: returnDuration,
//                 ease: "elastic.out(1,0.75)",
//               });
//               dot._inertiaApplied = false;
//             },
//           });
//         }
//       }
//     };

//     const onClick = (e: MouseEvent) => {
//       const rect = canvasRef.current!.getBoundingClientRect();
//       const cx = e.clientX - rect.left;
//       const cy = e.clientY - rect.top;
//       for (const dot of dotsRef.current) {
//         const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
//         if (dist < shockRadius && !dot._inertiaApplied) {
//           dot._inertiaApplied = true;
//           gsap.killTweensOf(dot);
//           const falloff = Math.max(0, 1 - dist / shockRadius);
//           const pushX = (dot.cx - cx) * shockStrength * falloff;
//           const pushY = (dot.cy - cy) * shockStrength * falloff;
//           gsap.to(dot, {
//             inertia: { xOffset: pushX, yOffset: pushY, resistance },
//             onComplete: () => {
//               gsap.to(dot, {
//                 xOffset: 0,
//                 yOffset: 0,
//                 duration: returnDuration,
//                 ease: "elastic.out(1,0.75)",
//               });
//               dot._inertiaApplied = false;
//             },
//           });
//         }
//       }
//     };

//     const throttledMove = throttle(onMove, 50);
//     window.addEventListener("mousemove", throttledMove, { passive: true });
//     window.addEventListener("click", onClick);

//     return () => {
//       window.removeEventListener("mousemove", throttledMove);
//       window.removeEventListener("click", onClick);
//     };
//   }, [
//     maxSpeed,
//     speedTrigger,
//     proximity,
//     resistance,
//     returnDuration,
//     shockRadius,
//     shockStrength,
//   ]);

//   return (
//     <section
//       className={`p-0 m-0 flex items-center justify-center h-full w-full absolute inset-0 z-0 pointer-events-none ${className}`}
//       style={style}
//     >
//       <div ref={wrapperRef} className="w-full h-full relative">
//         <canvas
//           ref={canvasRef}
//           className="absolute inset-0 w-full h-full pointer-events-none"
//         />
//       </div>
//     </section>
//   );
// };

// export default DotGrid;


'use client';
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(InertiaPlugin);

const throttle = (func: (...args: any[]) => void, limit: number) => {
  let lastCall = 0;
  return function (this: any, ...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _inertiaApplied: boolean;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function parseHSL(str: string) {
  const m = str.match(/^hsl\(\s*([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)$/i);
  if (!m) return undefined;
  const h = (parseFloat(m[1]) % 360) / 360;
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  return hslToRgb(h, s, l);
}

function colorToRgb(color: string) {
  if (color.startsWith("#")) {
    const m = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16),
    };
  }
  if (color.startsWith("hsl")) {
    return parseHSL(color) || { r: 0, g: 0, b: 0 };
  }
  return { r: 0, g: 0, b: 0 };
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 5,
  gap = 15,
  baseColor = "hsl(147,84%,85%)",
  activeColor = "hsl(149,100%,45%)",
  proximity = 120,
  shockRadius = 250,
  shockStrength = 5,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });

  const baseRgb = useMemo(() => colorToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => colorToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === "undefined" || !window.Path2D) return null;
    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;

    let rafId: number;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        let style = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          style = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(circlePath!);
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

  useEffect(() => {
    buildGrid();
    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(buildGrid);
      wrapperRef.current && ro.observe(wrapperRef.current);
    } else {
      window.addEventListener("resize", buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", buildGrid);
    };
  }, [buildGrid]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const throttledMove = throttle(onMove, 50);
    window.addEventListener("mousemove", throttledMove, { passive: true });
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", throttledMove);
      window.removeEventListener("click", onClick);
    };
  }, [shockRadius, shockStrength, resistance, returnDuration]);

  return (
    <section
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      style={style}
    >
      <div ref={wrapperRef} className="w-full h-full relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>
    </section>
  );
};

export default DotGrid;