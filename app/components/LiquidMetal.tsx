"use client";

import React, { memo, forwardRef } from "react";
import { LiquidMetal as LiquidMetalShader } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

export interface LiquidMetalProps {
  colorBack?: string;
  colorTint?: string;
  speed?: number;
  repetition?: number;
  distortion?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const LiquidMetal = memo(function LiquidMetal({
  // 🟢 Defaults: Bags green instead of grey
  colorBack = "#02FF40",
  colorTint = "#bbf7d0",
  speed = 0.5,
  repetition = 4,
  distortion = 0.1,
  scale = 1,
  className,
  style,
}: LiquidMetalProps) {
  return (
    <div
      className={cn("absolute inset-0 z-0 overflow-hidden", className)}
      style={style}
    >
      <LiquidMetalShader
        colorBack={colorBack}
        colorTint={colorTint}
        speed={speed}
        repetition={repetition}
        distortion={distortion}
        softness={0}
        shiftRed={0.3}
        shiftBlue={-0.3}
        angle={45}
        shape="none"
        scale={scale}
        fit="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
});

LiquidMetal.displayName = "LiquidMetal";

export interface LiquidMetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  borderWidth?: number;
  metalConfig?: Omit<LiquidMetalProps, "className" | "style">;
  size?: "sm" | "md" | "lg";
}

export const LiquidMetalButton = forwardRef<
  HTMLButtonElement,
  LiquidMetalButtonProps
>(
  (
    {
      children,
      icon,
      borderWidth = 4,
      metalConfig,
      size = "md",
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const sizeStyles = {
      sm: "py-2 pl-2 pr-6 gap-2 text-lg font-semibold",
      md: "py-3 pl-3 pr-8 gap-3 text-xl font-semibold",
      lg: "py-4 pl-4 pr-10 gap-4 text-2xl font-semibold",
    };

    const iconSizes = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      >
        <div
          className="relative overflow-hidden rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]"
          style={{ padding: borderWidth }}
        >
          {/* 🟢 Liquid border is Bags green by default */}
          <LiquidMetal
            colorBack={metalConfig?.colorBack ?? "#02FF40"}
            colorTint={metalConfig?.colorTint ?? "#bbf7d0"}
            speed={metalConfig?.speed ?? 0.4}
            repetition={metalConfig?.repetition ?? 4}
            distortion={metalConfig?.distortion ?? 0.15}
            scale={metalConfig?.scale ?? 1}
            className="absolute inset-0 z-0 rounded-full"
          />

          {/* 🟢 Inner pill: solid Bags green CTA */}
          <div
            className={cn(
              "relative z-10 flex items-center rounded-full",
              "bg-[#02FF40] text-black shadow-[0_0_25px_rgba(0,255,90,0.3)]",
              sizeStyles[size],
            )}
          >
            {icon && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-full",
                  iconSizes[size],
                )}
              >
                <span className="text-black">{icon}</span>
              </div>
            )}
            <span className="tracking-tight text-black">
              {children}
            </span>
          </div>
        </div>
      </button>
    );
  },
);

LiquidMetalButton.displayName = "LiquidMetalButton";
export default LiquidMetalButton;