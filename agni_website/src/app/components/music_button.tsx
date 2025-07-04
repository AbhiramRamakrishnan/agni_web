"use client";
import React, { useRef, useEffect } from "react";

const size = 90;
const cx = size / 2;
const cy = size / 2;
const radius = 44;
const numPoints = 20;
const startX = -18;
const endX = 15;
const amp = 8;
const freq = 2.2;

// Easing for super smoothness
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Helper: distance cursor to center
function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export default function MusicFluidInteractive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation state in refs
  const fluidActive = useRef(false);
  const fluidFill = useRef(0.0);
  const fluidTargetFill = useRef(0.0);
  const fluidFillSpeed = 0.16;
  const fluidOrigin = useRef({ x: cx, y: cy });
  const fluidCurrentOrigin = useRef({ x: cx, y: cy });

  // Wave morphing animation state in refs
  const isWave = useRef(true);
  const morphStart = useRef<number | null>(null);
  const morphFrom = useRef(1);
  const morphTo = useRef(1);
  const morphProgress = useRef(1);

  // Precompute X positions for wave
  const points = React.useMemo(
    () =>
      Array(numPoints)
        .fill(0)
        .map((_, i) => startX + ((endX - startX) * i) / (numPoints - 1)),
    []
  );

  // Mouse detection helpers
  function getMousePos(
    evt: React.MouseEvent | MouseEvent | TouchEvent
  ): { x: number; y: number } {
    const canvas = canvasRef.current;
    if (!canvas) return { x: cx, y: cy };
    const rect = canvas.getBoundingClientRect();
    let clientX = 0,
      clientY = 0;
    if ("touches" in evt && evt.touches.length > 0) {
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    } else if ("clientX" in evt && "clientY" in evt) {
      clientX = evt.clientX;
      clientY = evt.clientY;
    }
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  // Mouse/touch listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function onPointerMove(e: MouseEvent | TouchEvent) {
      const { x, y } = getMousePos(e);
      const inside = dist(x, y, cx, cy) < radius;
      if (inside && !fluidActive.current) {
        // On entry: set origin and activate
        fluidOrigin.current = { x, y };
        fluidCurrentOrigin.current = { x, y };
        fluidActive.current = true;
        fluidTargetFill.current = 1.0;
      } else if (!inside && fluidActive.current) {
        // On exit: set to drain
        fluidActive.current = false;
        fluidTargetFill.current = 0.0;
      }
    }
    function onMouseLeave() {
      fluidActive.current = false;
      fluidTargetFill.current = 0.0;
    }
    function onMouseEnter(e: MouseEvent) {
      const { x, y } = getMousePos(e);
      if (dist(x, y, cx, cy) < radius) {
        fluidOrigin.current = { x, y };
        fluidCurrentOrigin.current = { x, y };
        fluidActive.current = true;
        fluidTargetFill.current = 1.0;
      }
    }
    function onTouchStart(e: TouchEvent) {
      const { x, y } = getMousePos(e);
      if (dist(x, y, cx, cy) < radius) {
        fluidOrigin.current = { x, y };
        fluidCurrentOrigin.current = { x, y };
        fluidActive.current = true;
        fluidTargetFill.current = 1.0;
      }
    }
    function onTouchEnd() {
      fluidActive.current = false;
      fluidTargetFill.current = 0.0;
    }

    canvas.addEventListener("mousemove", onPointerMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("touchmove", onPointerMove);
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("mousemove", onPointerMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onPointerMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line
  }, []);

  // Wave/line toggle on click
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function onClick() {
      if (morphProgress.current < 1) return;
      isWave.current = !isWave.current;
      morphStart.current = performance.now();
      morphFrom.current = morphTo.current;
      morphTo.current = isWave.current ? 1 : 0;
      morphProgress.current = 0;
    }
    canvas.addEventListener("click", onClick);
    return () => {
      canvas.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line
  }, []);

  // Draw and animate
  useEffect(() => {
    let running = true;
    function draw(
      now: number,
      t: number,
      morph: number,
      fluidFillValue: number
    ) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fluid fill
      if (fluidFillValue > 0.001) {
        const fillRadius = radius * easeInOut(fluidFillValue);
        // Smooth origin movement
        fluidCurrentOrigin.current.x +=
          (fluidOrigin.current.x - fluidCurrentOrigin.current.x) * 0.25;
        fluidCurrentOrigin.current.y +=
          (fluidOrigin.current.y - fluidCurrentOrigin.current.y) * 0.25;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();

        ctx.beginPath();
        ctx.arc(
          fluidCurrentOrigin.current.x,
          fluidCurrentOrigin.current.y,
          fillRadius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "#82f3b8";
        ctx.globalAlpha = 0.92;
        ctx.shadowColor = "#82f3b8";
        ctx.shadowBlur = 8 * easeInOut(fluidFillValue);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // Background circle (drawn above the fluid)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#eceef7";
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.restore();

      // Draw wave/line
      ctx.save();
      ctx.translate(cx, cy + 3);

      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#171717";

      for (let i = 0; i < numPoints; i++) {
        const phase = i * 0.4;
        const centerFactor =
          1 - Math.abs((i - (numPoints - 1) / 2) / ((numPoints - 1) / 2));
        const localAmp = amp * (0.5 + 0.5 * centerFactor);
        const waveY = Math.sin(t * freq + phase) * localAmp;
        const y = waveY * morph;
        if (i === 0) ctx.moveTo(points[i], y);
        else ctx.lineTo(points[i], y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function animate(now: number) {
      if (!running) return;
      const t = now / 1000;

      // Morphing logic
      if (morphProgress.current < 1) {
        const elapsed = morphStart.current
          ? now - morphStart.current
          : 0;
        morphProgress.current = Math.min(1, elapsed / 400);
      }
      const morph =
        morphFrom.current +
        (morphTo.current - morphFrom.current) *
          easeInOut(morphProgress.current);

      // Animate fluid fill towards target
      if (fluidFill.current !== fluidTargetFill.current) {
        const dt = 1 / 60;
        const speed = Math.max(
          0.08,
          fluidFillSpeed *
            (fluidTargetFill.current > fluidFill.current ? 1.5 : 1)
        );
        fluidFill.current +=
          (fluidTargetFill.current - fluidFill.current) *
          Math.min(1, speed * dt * 60);
        if (
          Math.abs(fluidFill.current - fluidTargetFill.current) < 0.005
        )
          fluidFill.current = fluidTargetFill.current;
      }

      draw(now, t, morph, fluidFill.current);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    return () => {
      running = false;
    };
    // eslint-disable-next-line
  }, [points]);

  return (
    <div className="flex items-center justify-center bg-[#f4f5fb] w-full h-full min-h-screen">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-pointer block"
        aria-label="Music interactive icon"
      />
    </div>
  );
}