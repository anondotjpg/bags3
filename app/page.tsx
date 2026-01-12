"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FiPlus, FiSearch } from "react-icons/fi";
import { motion, type MotionProps } from "motion/react";
import { DottedMap } from "./components/DottedMap";

const shinyAnimationProps: MotionProps = {
  initial: { "--x": "100%" },
  animate: { "--x": "-100%" },
  whileTap: { scale: 0.97 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as MotionProps;

const EARNINGS_START = 21_000_000;

export default function Home() {
  const earningsSpanRef = useRef<HTMLSpanElement | null>(null);
  const earningsValueRef = useRef<number>(EARNINGS_START);

  // Update earnings without causing React re-renders
  useEffect(() => {
    const node = earningsSpanRef.current;
    if (!node) return;

    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 401) + 300; // 300–700
      earningsValueRef.current += increment;
      node.textContent = `$${earningsValueRef.current.toLocaleString(
        "en-US"
      )}+`;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      {/* HEADER */}
      <header className="border-b-2 border-white/5 bg-[#050507]">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-4 md:px-7">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/bags.png"
              alt="Bags logo"
              width={36}
              height={36}
              className="h-9 w-9"
            />
          </div>

          {/* Search */}
          <div className="flex-1">
            <div
              className="
                flex items-center
                rounded-full
                bg-[#141414]
                px-5 py-2
                shadow-[0_0_0_2px_rgba(255,255,255,0.07),0_0_0_1px_rgba(0,0,0,0.85)_inset,0_0_10px_rgba(0,0,0,0.5)_inset]
              "
            >
              <FiSearch className="mr-2.5 text-[17px] text-neutral-600" />
              <input
                type="text"
                placeholder="Search by CA or ticker"
                className="
                  w-full bg-transparent text-[15px]
                  text-neutral-200 placeholder:text-neutral-500
                  focus:outline-none
                "
              />
            </div>
          </div>

          <nav className="hidden items-center gap-5 text-sm md:flex">
            {/* [$100K challenge] */}
            <div
              className="
                flex items-center gap-1 text-[14px]
                text-neutral-300
                hover:text-white
                transition-colors
                cursor-pointer
              "
            >
              <span>[$100K challenge]</span>
            </div>

            {/* [how it works] */}
            <button
              type="button"
              className="
                text-[14px]
                text-neutral-300
                hover:text-white
                transition-colors
                cursor-pointer
              "
            >
              <span>[how it works]</span>
            </button>
          </nav>

          {/* Right buttons */}
          <div className="flex items-center gap-2.5">
            {/* create */}
            <button
              type="button"
              className="
                hidden md:inline-flex items-center justify-center
                rounded-full bg-[#02FF40]
                px-7 py-2.5
                text-sm font-semibold text-black
                transform will-change-transform
                transition-transform duration-150 ease-in-out
                hover:scale-[1.02]
                cursor-pointer
              "
            >
              <FiPlus className="mr-2 text-[19px]" />
              <span className="font-bold">create</span>
            </button>

            {/* log in */}
            <button
              type="button"
              className="
                inline-flex items-center justify-center
                rounded-full bg-white
                px-7 py-2.5
                text-sm text-black
                transform will-change-transform
                transition-transform duration-150 ease-in-out
                font-bold
                cursor-pointer
              "
            >
              <span>log in</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      {/* note: overflow-x-hidden so vertical decoration won't get clipped */}
      <section className="relative flex items-center justify-center px-6 py-16 overflow-hidden">
        {/* Dotted map background at bottom */}
        <div
          className="
            pointer-events-none
            absolute inset-x-0 bottom-0
            z-0
            opacity-20
            transform-gpu translate-y-10
          "
        >
          <DottedMap
            className="w-full h-full"
            dotRadius={0.15}
          />
        </div>

        <div className="max-w-3xl text-center z-10">
          {/* Earnings pill */}
          <div className="inline-flex items-center rounded-full bg-[rgba(0,0,0,0.9)] border border-white/10 px-5 py-2 mb-5 shadow-lg backdrop-blur-sm">
            <span
              ref={earningsSpanRef}
              className="text-sm font-semibold text-white tracking-[0.02em]"
            >
              ${EARNINGS_START.toLocaleString("en-US")}+
            </span>
            <span className="ml-1 text-sm text-neutral-300">
              in creator earnings
            </span>
          </div>

          {/* Hero text */}
          <h1 className="text-4xl md:text-[87px] font-semibold text-white tracking-tight leading-[0.9]">
            We&apos;re funding
            <br />
            the future.
          </h1>

          <p className="mt-4 text-sm md:text-base text-neutral-400">
            What are you building?
          </p>

          {/* CTA button - Shiny Version */}
          <motion.button
            type="button"
            className="
              relative mt-8 inline-flex items-center justify-center
              rounded-full bg-[#02FF40]
              px-10 py-3
              text-base md:text-lg font-semibold text-black
              shadow-[0_0_40px_rgba(0,255,90,0.15)]
              transform will-change-transform
              transition
              duration-150 ease-in-out
              overflow-hidden
              hover:scale-[1.02]
              cursor-pointer
            "
            {...shinyAnimationProps}
          >
            {/* Shiny glimmer overlay */}
            <span
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                backgroundImage:
                  "linear-gradient(-75deg, transparent calc(var(--x) + 20%), rgba(255,255,255,0.5) calc(var(--x) + 25%), transparent calc(var(--x) + 100%))",
              }}
            />
            <FiPlus className="relative mr-2 text-3xl" />
            <span className="relative font-bold">get funded</span>
          </motion.button>
        </div>
      </section>
    </main>
  );
}