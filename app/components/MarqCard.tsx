import Image from "next/image";
import React from "react";
import { IoPeopleSharp } from "react-icons/io5";

export type MarqueeToken = {
  id: number;
  name: string;
  symbol: string;
  tokenImage: string;        // e.g. "/t1.webp"
  feeEarnerUsername: string; // can be "user" or "@user"
  feeEarnerAvatar: string;   // e.g. "/c1.webp"
  earningsDisplay: string;   // e.g. "$27,472.36"
  holdersDisplay: string;    // e.g. "1,204.5"
};

type MarqueeCardProps = {
  token: MarqueeToken;
  className?: string;
};

const MAX_USERNAME_CHARS = 8;

export function MarqueeCard({ token, className = "" }: MarqueeCardProps) {
  // build X profile URL, strip leading @ if present
  const handle = token.feeEarnerUsername.replace(/^@/, "");
  const profileUrl = `https://x.com/${handle}`;

  // display username with character limit (does not affect link)
  let displayUsername = token.feeEarnerUsername;
  if (displayUsername.length > MAX_USERNAME_CHARS) {
    displayUsername =
      displayUsername.slice(0, MAX_USERNAME_CHARS - 1) + "…";
  }

  // 🔢 ensure we only show whole-number displays
  const earningsWhole = token.earningsDisplay.split(".")[0];
  const holdersWhole = token.holdersDisplay.split(".")[0];

  return (
    <div
      className={`
        relative
        h-40 sm:h-44
        w-[260px] sm:w-[300px]
        flex-shrink-0
        rounded-2xl
        bg-[#050506]
        border border-white/10
        overflow-hidden
        px-5 py-4
        flex flex-col justify-between
        ${className}
      `}
    >
      {/* neutral vignette – no color tint */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.14),transparent_55%),radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.95),transparent_60%)]
          opacity-60
        "
      />

      {/* TOP: left = token image + symbol/name, right = holder count */}
      <div className="relative flex items-start justify-between gap-4">
        {/* Left: token image + symbol/name */}
        <div className="flex min-w-0 items-center gap-4">
          <div
            className="
              relative
              h-12 w-12
              flex items-center justify-center
            "
          >
            {/* Inner wrapper: 1x1 square + clipping */}
            <div
              className="
                relative
                h-full w-full
                aspect-square
                rounded-xl overflow-hidden
                bg-[#151515]
                border border-white/10
                flex items-center justify-center
              "
            >
              <Image
                src={token.tokenImage}
                alt={`${token.name} logo`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            {/* Verified badge bottom-right */}
            <div
              className="
                absolute -bottom-1 -right-1
                h-4 w-4
                rounded-full
                border border-[#050506]
                bg-[#050506]
                overflow-hidden
              "
            >
              <Image
                src="/ver.webp"
                alt="Verified badge"
                width={16}
                height={16}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col text-left">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-300">
              {token.symbol}
            </span>
            <p className="mt-0.5 max-w-[170px] line-clamp-2 text-[16px] font-semibold text-white sm:max-w-[200px] sm:text-[14px]">
              {token.name}
            </p>
          </div>
        </div>

        {/* Right: holders pill */}
        <div
          className="
            inline-flex shrink-0 items-center gap-1.5
            rounded-full border border-white/12
            bg-black/70
            px-2.5 py-1
            text-[11px] text-neutral-200
          "
        >
          <IoPeopleSharp className="text-[14px]" />
          <span className="tabular-nums">{holdersWhole}</span>
        </div>
      </div>

      {/* BOTTOM: left = X user pill, right = earnings */}
      <div className="relative mt-4 flex items-end justify-between gap-3">
        {/* Earner pill */}
        <div className="flex flex-col">
          <span className="mb-1 block text-[9px] uppercase tracking-[0.2em] text-neutral-500">
            earner
          </span>

          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center gap-2.5
              rounded-full border border-white/12
              bg-black/75
              px-3.5 py-1.75
              text-[12px] text-neutral-200
              no-underline
              hover:border-white/40
              hover:bg-black/90
              transition
            "
          >
            <div className="h-8 w-8 overflow-hidden rounded-full border border-white/15 bg-[#111111]">
              <Image
                src={token.feeEarnerAvatar}
                alt={`${token.feeEarnerUsername} avatar`}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>

            <span className="max-w-[100px] truncate sm:max-w-[120px]">
              {displayUsername}
            </span>

            <span className="ml-1 text-[16px] leading-none">𝕏</span>
          </a>
        </div>

        {/* Earnings bottom-right */}
        <div className="text-right">
          <span className="block text-[9px] uppercase tracking-[0.2em] text-neutral-500">
            earned
          </span>
          <p className="mt-1 text-[18px] font-semibold leading-none text-white sm:text-[20px]">
            {earningsWhole}
          </p>
        </div>
      </div>
    </div>
  );
}