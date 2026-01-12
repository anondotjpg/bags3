"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FiPlus, FiSearch } from "react-icons/fi";
import { motion, type MotionProps } from "motion/react";
import Marquee from "react-fast-marquee";
import { DottedMap } from "./components/DottedMap";
import { Iphone } from "./components/Iphone";
import { MarqueeCard, MarqueeToken } from "./components/MarqueeCard";

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

// 🔹 Marquee token JSON you can customize
const MARQUEE_TOKENS: MarqueeToken[] = [
  {
    id: 1,
    name: "Ralph Wiggum",
    symbol: "RALPH",
    tokenImage: "/t1.webp",
    feeEarnerUsername: "GeoffreyHuntley",
    feeEarnerAvatar: "/c1.webp",
    earningsDisplay: "$105,097.26",
    holdersDisplay: "2,542",
  },
  {
    id: 2,
    name: "Vibe Virtual Machine",
    symbol: "VVM",
    tokenImage: "/z.webp",
    feeEarnerUsername: "thekaranchawla",
    feeEarnerAvatar: "/c2.webp",
    earningsDisplay: "$28,952",
    holdersDisplay: "775",
  },
  {
    id: 3,
    name: "Nyan Cat",
    symbol: "NYAN",
    tokenImage: "/t3.webp",
    feeEarnerUsername: "PRguitarman",
    feeEarnerAvatar: "/c3.webp",
    earningsDisplay: "$400,308",
    holdersDisplay: "3,579",
  },
  {
    id: 4,
    name: "Natecoin",
    symbol: "NATE",
    tokenImage: "/t4.webp",
    feeEarnerUsername: "Nate_Esparza",
    feeEarnerAvatar: "/c4.webp",
    earningsDisplay: "$18,309",
    holdersDisplay: "430",
  },
  {
    id: 5,
    name: "Claude Memory",
    symbol: "CMEM",
    tokenImage: "/t5.webp",
    feeEarnerUsername: "Claude_Memory",
    feeEarnerAvatar: "/c5.webp",
    earningsDisplay: "$21,058",
    holdersDisplay: "768",
  },
];

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
            <a
              href="https://bags.fm/drops"
              className="
                flex items-center gap-1 text-[14px]
                text-neutral-300
                hover:text-white
                transition-colors
                cursor-pointer
              "
            >
              <span>[$100K challenge]</span>
            </a>

            {/* [how it works] */}
            <a
              href="https://bags.fm/how-it-works"
              className="
                text-[14px]
                text-neutral-300
                hover:text-white
                transition-colors
                cursor-pointer
              "
            >
              <span>[how it works]</span>
            </a>
          </nav>

          {/* Right buttons */}
          <div className="flex items-center gap-2.5">
            {/* create */}
            <a
              href="https://bags.fm/launch"
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
            </a>

            {/* log in */}
            <a
              href="https://bags.fm/login"
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
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex items-center justify-center px-6 py-32 overflow-hidden">
        {/* Dotted map background at bottom */}
        <div
          className="
            pointer-events-none
            absolute inset-x-0 bottom-0
            z-0
            opacity-25
            transform-gpu translate-y-10
          "
        >
          <DottedMap className="w-full h-full" dotRadius={0.15} />
        </div>

        <div className="max-w-3xl text-center z-10 -mt-16">
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
          <motion.a
            href="https://bags.fm/launch"
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
          </motion.a>
        </div>
      </section>

      {/* iPhone mockup under hero */}
      <section className="relative flex flex-col items-center px-6 pb-16 overflow-hidden -mt-16">
        {/* floor.webp background behind marquee + iPhone (full width) */}
        <div
          className="
            pointer-events-none
            absolute inset-x-0 bottom-0
            z-25
            h-56 md:h-100
          "
        >
          <Image
            src="/floor.webp"
            alt=""
            fill
            className="object-cover grayscale"
          />
          {/* dark overlay */}
          <div className="absolute inset-0 bg-[#050507]/75" />
          {/* fade toward top */}
          <div className="absolute inset-0 bg-linear-to-b from-[#050507] via-[#050507]/60 to-transparent" />
        </div>

        <p className="mb-4 text-xs tracking-wider text-neutral-700 z-20">
          you are clicks away from this
        </p>

        {/* Full-width marquee behind iPhone (react-fast-marquee) */}
        <div className="pointer-events-none absolute inset-x-0 top-2/5 -translate-y-1/2 z-10 overflow-hidden blur-[0.5px] invisible md:visible">
          <Marquee gradient={false} speed={40} pauseOnHover={false}>
            {Array.from({ length: 3 }).flatMap((_, loopIndex) =>
              MARQUEE_TOKENS.map((token) => (
                <MarqueeCard
                  key={`${loopIndex}-${token.id}`}
                  token={token}
                  className="mr-4"
                />
              ))
            )}
          </Marquee>
        </div>

        {/* iPhone on top, centered - with fade elements behind */}
        <div className="relative z-30 w-[320px] md:w-[434px]">
          {/* Left fade gradient */}
          <div
            className="pointer-events-none absolute top-0 h-[70%] w-[75px] z-20"
            style={{
              right: "97%",
              background:
                "linear-gradient(to left, rgba(5,5,7,1) 0%, rgba(5,5,7,0.7) 30%, rgba(5,5,7,0.4) 60%, rgba(5,5,7,0) 100%)",
            }}
          />
          {/* Right fade gradient */}
          <div
            className="pointer-events-none absolute top-0 h-[70%] w-[75px] z-20"
            style={{
              left: "97%",
              background:
                "linear-gradient(to right, rgba(5,5,7,1) 0%, rgba(5,5,7,0.7) 30%, rgba(5,5,7,0.4) 60%, rgba(5,5,7,0) 100%)",
            }}
          />
          <div className="z-30">
            <Iphone src="flex3.png" />
          </div>
        </div>
      </section>
    </main>
  );
}