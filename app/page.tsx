"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiPlus, FiSearch } from "react-icons/fi";
import { motion, type MotionProps } from "motion/react";
import FastMarquee from "react-fast-marquee";

import { DottedMap } from "./components/DottedMap";
import { Iphone } from "./components/Iphone";
import { MarqueeCard, MarqueeToken } from "./components/MarqueeCard";
import { AvatarCircles } from "./components/Avatar";
import { cn } from "@/lib/utils";
import { Marqueee } from "./components/Marq";
import { MagicCard } from "./components/MagicCard";
import DitherShader from "./components/dither-shader";
import { BagsBento } from "./components/BagsBento";

// ElevenLabs Matrix + presets (your local implementation using useId)
import { Matrix, digits, wave } from "./components/Matrix";

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
const VARIABLE_WORDS = ["project", "business", "app", "cause", "anything"];

// 🔢 Daily flex number (only shown via Matrix digits)
const FUNDED_TODAY = 1284;
const FUNDED_TODAY_DIGITS = FUNDED_TODAY.toString().split("");

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % VARIABLE_WORDS.length),
      2200,
    );
    return () => clearInterval(interval);
  }, []);

  return <span>{VARIABLE_WORDS[index]}</span>;
}

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

const AVATAR_URLS = MARQUEE_TOKENS.map((token) => ({
  imageUrl: token.feeEarnerAvatar,
  profileUrl: `https://twitter.com/${token.feeEarnerUsername}`,
}));

const reviews = [
  {
    name: "Jukez",
    username: "@jukezpilled",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "jukez.jpg",
  },
  {
    name: "Elon",
    username: "@elonmusk",
    body: "Bags is the best way to raise money online. period.",
    img: "elon.jpg",
  },
  {
    name: "Finn",
    username: "@finnbags",
    body: "We’re funding the future. We're also about to give cracked @jukezpilled a job.",
    img: "finn.jpg",
  },
];

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => (
  <figure
    className={cn(
      "relative h-full w-fit cursor-pointer overflow-hidden rounded-xl border p-4 sm:w-36 md:w-48",
      "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
      "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
    )}
  >
    <div className="flex flex-row items-center gap-2">
      <img className="rounded-full" width="32" height="32" alt="" src={img} />
      <div className="flex flex-col">
        <figcaption className="text-sm font-medium dark:text-white">
          {name}
        </figcaption>
        <p className="text-xs font-medium dark:text-white/40">{username}</p>
      </div>
    </div>
    <blockquote className="mt-2 text-sm">{body}</blockquote>
  </figure>
);

export function Marquee3D() {
  return (
    <div className="relative flex h-96 w-[80%] flex-row items-center justify-center gap-4 overflow-hidden md:my-32">
      <Marqueee pauseOnHover vertical className="w-1/4 [--duration:20s]">
        {reviews.map((review) => (
          <ReviewCard key={`col1-${review.username}`} {...review} />
        ))}
      </Marqueee>
      <Marqueee
        reverse
        pauseOnHover
        vertical
        className="w-1/4 [--duration:22s]"
      >
        {reviews.map((review) => (
          <ReviewCard key={`col2-${review.username}`} {...review} />
        ))}
      </Marqueee>
      <Marqueee
        reverse
        pauseOnHover
        vertical
        className="w-1/4 [--duration:18s]"
      >
        {reviews.map((review) => (
          <ReviewCard key={`col3-${review.username}`} {...review} />
        ))}
      </Marqueee>
      <Marqueee pauseOnHover vertical className="w-1/4 [--duration:24s]">
        {reviews.map((review) => (
          <ReviewCard key={`col4-${review.username}`} {...review} />
        ))}
      </Marqueee>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#050507] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#050507] to-transparent" />
    </div>
  );
}

export default function Home() {
  const earningsSpanRef = useRef<HTMLSpanElement | null>(null);
  const earningsValueRef = useRef<number>(EARNINGS_START);

  useEffect(() => {
    const node = earningsSpanRef.current;
    if (!node) return;

    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 401) + 300;
      earningsValueRef.current += increment;
      node.textContent = `$${earningsValueRef.current.toLocaleString(
        "en-US",
      )}+`;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      {/* HEADER */}
      <header className="border-b-2 border-white/5 bg-[#050507]">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-4 md:px-7">
          <div className="flex items-center">
            <Image
              src="/bags.png"
              alt="Bags logo"
              width={36}
              height={36}
              className="h-9 w-9"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center rounded-full bg-[#141414] px-5 py-2 shadow-[0_0_0_2px_rgba(255,255,255,0.07),0_0_0_1px_rgba(0,0,0,0.85)_inset,0_0_10px_rgba(0,0,0,0.5)_inset]">
              <FiSearch className="mr-2.5 text-[17px] text-neutral-600" />
              <input
                type="text"
                placeholder="Search by CA or ticker"
                className="w-full bg-transparent text-[15px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <nav className="hidden items-center gap-5 text-sm md:flex">
            <a
              href="https://bags.fm/drops"
              className="flex cursor-pointer items-center gap-1 text-[14px] text-neutral-300 transition-colors hover:text-white"
            >
              <span>[$100K challenge]</span>
            </a>
            <a
              href="https://bags.fm/how-it-works"
              className="cursor-pointer text-[14px] text-neutral-300 transition-colors hover:text-white"
            >
              <span>[how it works]</span>
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="https://bags.fm/launch"
              className="hidden transform cursor-pointer items-center justify-center rounded-full bg-[#02FF40] px-7 py-2.5 text-sm font-semibold text-black transition-transform duration-150 ease-in-out hover:scale-[1.02] md:inline-flex"
            >
              <FiPlus className="mr-2 text-[19px]" />
              <span className="font-bold">create</span>
            </a>
            <a
              href="https://bags.fm/login"
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white/100 px-7 py-2.5 text-sm font-bold text-black transition-colors duration-150 hover:bg-white/90"
            >
              <span>log in</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex items-center justify-center overflow-hidden px-6 py-32">
        {/* HERO floor background (replaces DottedMap) */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <DitherShader
            src="floor.webp"
            gridSize={3}
            ditherMode="bayer"
            colorMode="grayscale"
            className="h-full w-full"
          />

          {/* overall darken */}
          <div className="absolute inset-0 bg-[#050507]/75" />

          {/* flipped gradient (fade INTO bottom) */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#050507]/35 to-[#050507]" />
        </div>

        <div className="z-10 -mt-16 max-w-3xl text-center">
          <div className="relative inline-flex items-center">
            <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-[rgba(0,0,0,0.9)] px-5 py-3 shadow-lg backdrop-blur-sm">
              <span
                ref={earningsSpanRef}
                className="text-sm font-semibold tracking-[0.02em] text-white"
              >
                ${EARNINGS_START.toLocaleString("en-US")}+
              </span>
              <span className="ml-1 text-sm text-neutral-300">
                in creator earnings
              </span>
            </div>

            <div className="pointer-events-auto absolute -right-6 -top-6 hidden md:block">
              <AvatarCircles
                numPeople={MARQUEE_TOKENS.length}
                avatarUrls={AVATAR_URLS}
                className="scale-75"
              />
            </div>
          </div>

          <h1 className="text-4xl font-semibold leading-[0.9] tracking-tight text:white text-white md:text-[87px]">
            We&apos;re funding
            <br />
            the future.
          </h1>

          <p className="mt-4 text-sm text-neutral-400 md:text-base">
            What are you building?
          </p>

          <motion.a
            href="https://bags.fm/launch"
            // EDITED: Added 3D shadow and click-down physics
            className="group relative mt-8 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#02FF40] px-10 py-3 text-base font-semibold text-black transition-all duration-150 ease-in-out md:text-lg shadow-[0_6px_0_#00cc33] hover:shadow-[0_8px_0_#00cc33] hover:-translate-y-[2px] active:shadow-none active:translate-y-[6px]"
            {...shinyAnimationProps}
            // Override the shiny animation scale tap to avoid conflict with CSS 3D translate
            whileTap={{ scale: 0.98 }} 
          >
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

      {/* iPhone + floor + marquee + bento + Matrix stats + mobile card */}
      <section className="relative -mt-16 flex flex-col items-center overflow-hidden px-6 pb-16">
        {/* dithered floor */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-25 h-56 md:h-100">
          <DitherShader
            src="floor.webp"
            gridSize={3}
            ditherMode="bayer"
            colorMode="grayscale"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-[#050507]/75" />
          <div className="absolute inset-0 bg-linear-to-b from-[#050507] via-[#050507]/60 to-transparent" />
        </div>

        <p className="z-20 mb-4 text-xs tracking-wider text-neutral-700">
          you are clicks away from this
        </p>

        {/* marquee behind iPhone */}
        <div className="pointer-events-none invisible absolute inset-x-0 top-1/6 z-10 -translate-y-1/2 overflow-hidden blur-[0.5px] md:visible">
          <FastMarquee gradient={false} speed={40} pauseOnHover={false}>
            {Array.from({ length: 3 }).flatMap((_, loopIndex) =>
              MARQUEE_TOKENS.map((token) => (
                <MarqueeCard
                  key={`${loopIndex}-${token.id}`}
                  token={token}
                  className="mr-4"
                />
              )),
            )}
          </FastMarquee>
        </div>

        {/* iPhone */}
        <div className="relative z-30 w-[320px] md:w-[434px]">
          <div
            className="pointer-events-none absolute top-0 z-20 h-[70%] w-[75px]"
            style={{
              right: "97%",
              background:
                "linear-gradient(to left, rgba(5,5,7,1) 0%, rgba(5,5,7,0.7) 30%, rgba(5,5,7,0.4) 60%, rgba(5,5,7,0) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute top-0 z-20 h-[70%] w-[75px]"
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

        {/* vertical marquee */}
        <div className="relative z-30 mt-10 mb-8 hidden w-full max-w-5xl justify-center lg:flex">
          <Marquee3D />
        </div>

        {/* Bags Mobile card */}
        <div className="mt-36 lg:mt-0 relative z-30 w-full max-w-5xl">
          <MagicCard className="mx-auto w-full">
            <div className="flex w-full flex-col items-center justify-between gap-2 px-6 py-4 md:flex-row md:items-start md:gap-10 md:px-10 md:py-7 md:pb-8">
              <div className="flex w-full items-center gap-4 md:flex-1 md:items-start md:gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/90 md:h-16 md:w-16">
                  <Image
                    src="/b.png"
                    alt="Bags Mobile icon"
                    width={48}
                    height={48}
                    className="h-10 w-10 md:h-11 md:w-11"
                  />
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold text-white md:text-lg">
                    Bags Mobile
                  </p>
                  <p className="text-xs text-neutral-300 md:hidden">
                    Get funded for your future
                  </p>
                  <p className="hidden text-xs text-neutral-300 md:block md:text-sm lg:text-base">
                    Get funded for your <RotatingWord />
                  </p>
                  <p className="mt-0.5 text-[11px] text-neutral-500 md:text-xs">
                    Available on iOS and Android
                  </p>
                </div>
              </div>

              <div className="flex w-full justify-center md:w-auto md:justify-end">
                <a
                  href="https://apps.apple.com/us/app/bags-trade-crypto-memes/id6473196333"
                  className="hidden lg:block"
                >
                  <Image
                    src="/bags-ios-qr.png"
                    alt="Scan to download Bags on iOS"
                    width={120}
                    height={120}
                    className="rounded-md border border-white/10"
                  />
                </a>
              </div>

              <a
                href="https://bags.fm/app-links"
                className="mt-1 inline-flex shrink-0 items-center justify-center rounded-full bg-[#02FF40]/100 px-7 py-2.5 text-sm font-semibold text-black shadow-[0_0_25px_rgba(0,255,90,0.1)] transition-colors duration-150 hover:bg-[#02FF40]/90 lg:absolute lg:bottom-5 lg:left-6 lg:mt-0"
              >
                download now
              </a>
            </div>
          </MagicCard>
        </div>
      </section>
    </main>
  );
}