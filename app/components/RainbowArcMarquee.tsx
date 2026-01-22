"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "motion/react";
import { MarqueeCard, MarqueeToken } from "./MarqueeCard";

interface RainbowArcMarqueeProps {
  tokens: MarqueeToken[];
  /** Arc curvature - higher = more curved (0.3-0.8 recommended) */
  curvature?: number;
  /** Animation speed in seconds for full loop */
  duration?: number;
  /** Width of the arc container */
  width?: number;
  /** Height/depth of the arc curve */
  arcHeight?: number;
  /** Show rainbow glow effect */
  showRainbowGlow?: boolean;
  className?: string;
}

// Rainbow colors for the arc gradient
const RAINBOW_COLORS = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#9400D3", // Violet
];

export function RainbowArcMarquee({
  tokens,
  curvature = 0.5,
  duration = 20,
  width = 1200,
  arcHeight = 200,
  showRainbowGlow = true,
  className = "",
}: RainbowArcMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Duplicate tokens for seamless looping
  const duplicatedTokens = [...tokens, ...tokens, ...tokens];
  const totalItems = duplicatedTokens.length;

  // Animation loop
  useAnimationFrame((time) => {
    const loopDuration = duration * 1000;
    setProgress((time % loopDuration) / loopDuration);
  });

  // Calculate position on arc for a given normalized position (0-1)
  const getArcPosition = (normalizedPos: number) => {
    // Map position to arc (-π to π for full arc)
    const angle = (normalizedPos - 0.5) * Math.PI * curvature * 2;

    // X position along the arc
    const x = Math.sin(angle) * (width / 2);

    // Y position (arc curve) - parabolic for smoother look
    const y = -Math.cos(angle) * arcHeight + arcHeight;

    // Scale based on position (items at edges are smaller/further)
    const scale = 0.6 + 0.4 * Math.cos(angle);

    // Opacity fade at edges
    const opacity = 0.3 + 0.7 * Math.cos(angle);

    // Z-index based on y position (items at top are in front)
    const zIndex = Math.round(100 - y);

    return { x, y, scale, opacity, zIndex };
  };

  // Get rainbow color at a given position
  const getRainbowColor = (normalizedPos: number) => {
    const colorIndex = normalizedPos * (RAINBOW_COLORS.length - 1);
    const lowerIndex = Math.floor(colorIndex);
    const upperIndex = Math.min(lowerIndex + 1, RAINBOW_COLORS.length - 1);
    const t = colorIndex - lowerIndex;

    // Simple color interpolation
    const lower = RAINBOW_COLORS[lowerIndex];
    const upper = RAINBOW_COLORS[upperIndex];

    return interpolateColor(lower, upper, t);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${arcHeight + 280}px`, // Extra space for cards
      }}
    >
      {/* Rainbow arc glow background */}
      {showRainbowGlow && (
        <svg
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 opacity-30"
          width={width}
          height={arcHeight + 100}
          viewBox={`0 0 ${width} ${arcHeight + 100}`}
        >
          <defs>
            <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {RAINBOW_COLORS.map((color, i) => (
                <stop
                  key={i}
                  offset={`${(i / (RAINBOW_COLORS.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="20" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={generateArcPath(width, arcHeight, curvature)}
            fill="none"
            stroke="url(#rainbowGradient)"
            strokeWidth="4"
            filter="url(#glow)"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Animated cards on the arc */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 50 }}
      >
        {duplicatedTokens.map((token, index) => {
          // Calculate this item's position in the loop
          const itemProgress = (index / totalItems + progress) % 1;
          const { x, y, scale, opacity, zIndex } = getArcPosition(itemProgress);

          // Get rainbow tint for this position
          const rainbowColor = getRainbowColor(itemProgress);

          return (
            <motion.div
              key={`${token.id}-${index}`}
              className="absolute"
              style={{
                x: x - 100, // Center the card (assuming ~200px width)
                y: y,
                scale,
                opacity,
                zIndex,
              }}
            >
              {/* Rainbow glow effect behind each card */}
              <div
                className="absolute inset-0 -z-10 rounded-2xl blur-xl"
                style={{
                  background: rainbowColor,
                  opacity: 0.3,
                  transform: "scale(1.1)",
                }}
              />
              <MarqueeCard token={token} className="w-[200px]" />
            </motion.div>
          );
        })}
      </div>

      {/* Edge fade gradients */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-50 w-32"
        style={{
          background:
            "linear-gradient(to right, #050507 0%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-50 w-32"
        style={{
          background:
            "linear-gradient(to left, #050507 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

// Helper: Generate SVG arc path
function generateArcPath(
  width: number,
  height: number,
  curvature: number
): string {
  const startX = 50;
  const endX = width - 50;
  const startY = height;
  const endY = height;
  const controlY = height - height * curvature * 2;

  return `M ${startX} ${startY} Q ${width / 2} ${controlY} ${endX} ${endY}`;
}

// Helper: Interpolate between two hex colors
function interpolateColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

// Alternative: CSS-only version for simpler implementation
export function RainbowArcMarqueeCSS({
  tokens,
  className = "",
}: {
  tokens: MarqueeToken[];
  className?: string;
}) {
  return (
    <div className={`relative h-[400px] w-full overflow-hidden ${className}`}>
      {/* Rainbow arc background glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[600px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-20 blur-3xl"
        style={{
          background: `conic-gradient(from 180deg at 50% 100%, 
            #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3, 
            #4B0082, #0000FF, #00FF00, #FFFF00, #FF7F00, #FF0000)`,
        }}
      />

      {/* Arc path container */}
      <div className="rainbow-arc-container absolute inset-0">
        {tokens.map((token, index) => (
          <div
            key={token.id}
            className="rainbow-arc-item absolute left-1/2 top-1/2"
            style={{
              // CSS custom properties for animation
              "--item-index": index,
              "--total-items": tokens.length,
              animation: `arcOrbit 15s linear infinite`,
              animationDelay: `${-(index / tokens.length) * 15}s`,
            } as React.CSSProperties}
          >
            <MarqueeCard token={token} className="w-[200px]" />
          </div>
        ))}
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-50 w-40 bg-gradient-to-r from-[#050507] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-50 w-40 bg-gradient-to-l from-[#050507] to-transparent" />

      <style jsx>{`
        @keyframes arcOrbit {
          0% {
            transform: translate(-50%, -50%) 
              translateX(calc(-500px)) 
              translateY(150px) 
              scale(0.6);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          25% {
            transform: translate(-50%, -50%) 
              translateX(calc(-250px)) 
              translateY(50px) 
              scale(0.85);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) 
              translateX(0px) 
              translateY(0px) 
              scale(1);
            opacity: 1;
          }
          75% {
            transform: translate(-50%, -50%) 
              translateX(calc(250px)) 
              translateY(50px) 
              scale(0.85);
            opacity: 0.8;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) 
              translateX(calc(500px)) 
              translateY(150px) 
              scale(0.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}