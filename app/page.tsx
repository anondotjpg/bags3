"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Image from "next/image";
import {
  FiPlus,
  FiGlobe,
  FiPlay,
  FiPause,
  FiRewind,
  FiFastForward,
} from "react-icons/fi";
import { motion, type MotionProps } from "motion/react";
import FastMarquee from "react-fast-marquee";
import { MarqueeCard, type MarqueeToken } from "./components/MarqCard";
import { AvatarCircles } from "./components/Avatar";

// ============ CONSTANTS (lazy-loaded where possible) ============

const EARNINGS_START = 21_000_000;

// Lazy load heavy data only when needed
const getMarqueeTokens = (): MarqueeToken[] => [
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
    feeEarnerUsername: "NATE_Esparza",
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

const NEWS_ITEMS = [
  "$GAS has broken a $40M market cap on @BagsApp, with $RALPH continuing higher and passing $20M MCAP shortly after.",
  "The platform continues to see strong momentum in AI-related narratives, with multiple reactions highlighting $GAS and $RALPH as leading examples of effective onboarding to Solana in 2026.",
  "Claiming earnings is now free on @BagsApp — the team is sponsoring all transaction costs, allowing one-click onboarding without needing SOL in the wallet.",
  "@finnbags announced ongoing work with founders in DMs to update and scale the onboarding process, noting that things are heating up fast.",
  "Upcoming features include using fees to pay DEX listings and buy boosts directly on @BagsApp, as teased in recent announcements.",
];

const TWEET_IDS = [
  "2012213774225125600",
  "2012074487760527635",
  "2012059085743800440",
  "2012057313549353177",
  "2012045940115505398",
  "2012040176152035531",
  "2012041524473937981",
];

// ============ TYPES ============

type BagsToken = {
  mint: string;
  name: string;
  symbol?: string;
  image?: string | null;
  links?: Record<string, string> | null;
};

// ============ MEMOIZED COMPONENTS ============

const ShinyButton = memo(function ShinyButton() {
  const shinyAnimationProps: MotionProps = {
    initial: { "--x": "100%" },
    animate: { "--x": "-100%" },
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 1,
      duration: 2.4,
    },
  } as MotionProps;

  return (
    <motion.a
      href="https://bags.fm/launch"
      className="relative inline-flex items-center justify-center rounded-full bg-[#02FF40] px-8 py-2.5 -mt-2 text-sm md:text-base font-semibold text-black overflow-hidden transition-transform duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.97]"
      {...shinyAnimationProps}
      whileTap={{ scale: 0.96 }}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          backgroundImage:
            "linear-gradient(-75deg, transparent calc(var(--x) + 20%), rgba(255,255,255,0.5) calc(var(--x) + 25%), transparent calc(var(--x) + 60%))",
        }}
      />
      <FiPlus className="relative mr-2 text-lg md:text-xl" />
      <span className="relative font-bold">get funded</span>
    </motion.a>
  );
});

const BentoCard = memo(function BentoCard({
  className,
  placeholder,
  children,
  innerClassName,
  noPaddingBottom,
}: {
  className?: string;
  placeholder?: string;
  children?: React.ReactNode;
  innerClassName?: string;
  noPaddingBottom?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-black/5 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(0,0,0,0.9)] h-full w-full ${className ?? ""}`}
    >
      <div
        className={`flex h-full w-full flex-col px-4 pt-3 ${noPaddingBottom ? "pb-0" : "pb-3"} text-[0.65rem] text-neutral-400 sm:text-xs md:text-sm ${innerClassName ?? ""}`}
      >
        {children ?? (
          <div className="flex h-full w-full items-center justify-center">
            <span className="opacity-60">{placeholder ?? "[ panel ]"}</span>
          </div>
        )}
      </div>
    </div>
  );
});

// Lazy-loaded video background with IntersectionObserver
const VideoBackground = memo(function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const target = document.getElementById("video-container");
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current && isVisible) {
      videoRef.current.playbackRate = .7;
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current && !isVisible) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  return (
    <div id="video-container" className="absolute inset-0">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/wall.webm"
        muted
        loop
        playsInline
        preload="none" // Don't preload - saves memory
      />
      <div className="absolute inset-0 bg-black/75" />
    </div>
  );
});

// Optimized Audio Player - only loads audio when interacted with
const AudioBento = memo(function AudioBento({ className }: { className?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const SONG_NAME = "I Get The Bag - Migos";

  const loadAudio = useCallback(() => {
    if (!isLoaded && audioRef.current) {
      audioRef.current.load();
      setIsLoaded(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlers = {
      loadedmetadata: () => setDuration(audio.duration || 0),
      timeupdate: () => setCurrentTime(audio.currentTime || 0),
      ended: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      audio.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        audio.removeEventListener(event, handler);
      });
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    loadAudio();

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  }, [isPlaying, loadAudio]);

  const seekBy = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const next = Math.min(Math.max(audio.currentTime + delta, 0), duration);
    audio.currentTime = next;
    setCurrentTime(next);
  }, [duration]);

  const handleScrub = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }, [duration]);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs: number) => {
    if (!secs || Number.isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <BentoCard className={className}>
      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[0.8rem] font-semibold uppercase tracking-wide text-neutral-300">
            Player
          </span>
          <span className="text-[0.7rem] text-neutral-500">Now playing</span>
        </div>

        <div className="mb-3 h-px w-full bg-white/10" />

        <div className="flex flex-1 items-center">
          <div className="flex w-full flex-col items-center gap-4">
            <div className="w-full truncate text-center text-[0.96rem] font-semibold text-neutral-100">
              {SONG_NAME}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => seekBy(-10)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-neutral-200 transition hover:bg-white/15 hover:border-white/50 active:scale-95"
              >
                <FiRewind className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white transition hover:bg-white/25 hover:border-white/70 active:scale-95"
              >
                {isPlaying ? <FiPause className="h-5 w-5" /> : <FiPlay className="h-5 w-5 translate-x-[1px]" />}
              </button>

              <button
                type="button"
                onClick={() => seekBy(10)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-neutral-200 transition hover:bg-white/15 hover:border-white/50 active:scale-95"
              >
                <FiFastForward className="h-5 w-5" />
              </button>
            </div>

            <div className="flex w-[80%] flex-col gap-1.5">
              <div
                className="relative h-2 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
                onClick={handleScrub}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#02FF40]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[0.75rem] text-neutral-400">
                <span className="tabular-nums">{formatTime(currentTime)}</span>
                <span className="tabular-nums opacity-70">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Only set src when needed, use preload="none" */}
            <audio ref={audioRef} src="/bags.mp3" preload="none" />
          </div>
        </div>
      </div>
    </BentoCard>
  );
});

// Optimized Earnings with requestAnimationFrame instead of setInterval
const EarningsBento = memo(function EarningsBento({ className }: { className?: string }) {
  const [earnings, setEarnings] = useState(EARNINGS_START);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    let rafId: number;

    const update = () => {
      const now = Date.now();
      if (now - lastUpdateRef.current >= 1000) {
        setEarnings((prev) => prev + Math.floor(Math.random() * 401) + 300);
        lastUpdateRef.current = now;
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const avatarUrls = getMarqueeTokens().map((token) => ({
    imageUrl: token.feeEarnerAvatar,
    profileUrl: `https://twitter.com/${token.feeEarnerUsername.replace(/^@/, "")}`,
  }));

  return (
    <BentoCard className={className}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center gap-2">
          <AvatarCircles
            numPeople={avatarUrls.length}
            avatarUrls={avatarUrls}
            className="scale-90 sm:scale-100"
          />
        </div>
        <div className="mt-3">
          <p className="text-lg font-semibold text-white sm:text-3xl">
            ${earnings.toLocaleString("en-US")}+
          </p>
          <p className="mt-1 text-[0.6rem] text-neutral-400">in creator earnings</p>
        </div>
      </div>
    </BentoCard>
  );
});

// X Feed - Load tweets lazily with IntersectionObserver
const TweetEmbed = memo(function TweetEmbed({ tweetId }: { tweetId: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-80 flex-shrink-0">
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {isVisible ? (
          <iframe
            src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=dark&dnt=true`}
            title={tweetId}
            loading="lazy"
            className="absolute -inset-1 h-[calc(100%+8px)] w-[calc(100%+8px)] border-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-neutral-500 text-xs">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
});

const XFeedBento = memo(function XFeedBento({ className }: { className?: string }) {
  return (
    <BentoCard className={className} noPaddingBottom>
      <div className="flex h-full flex-col">
        <div className="mb-1 flex flex-shrink-0 items-center justify-between gap-2">
          <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-neutral-300">
            Recent posts
          </span>
        </div>
        <div className="mb-1 h-px w-full flex-shrink-0 bg-white/10" />
        <div className="mt-1 flex-1 min-h-0 pb-3">
          <div className="flex h-full w-full gap-3 overflow-x-auto">
            {TWEET_IDS.map((id) => (
              <TweetEmbed key={id} tweetId={id} />
            ))}
          </div>
        </div>
      </div>
    </BentoCard>
  );
});

// News Bento with visibility-based animation
const NewsBento = memo(function NewsBento({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % NEWS_ITEMS.length);
    }, 5000);

    return () => clearInterval(id);
  }, [isVisible]);

  return (
    <BentoCard className={className} noPaddingBottom>
      <div ref={containerRef} className="flex h-full flex-col">
        <div className="mb-2 flex flex-shrink-0 items-center justify-between gap-2">
          <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-neutral-300">
            News
          </span>
          <a
            href="https://x.com/BNNBags"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[0.6rem] text-neutral-400 hover:text-white"
          >
            <span className="uppercase tracking-wide">powered by</span>
            <div className="h-7 w-7 overflow-hidden rounded-lg border border-white/25 bg-white/5">
              <Image src="/bnn.jpg" alt="BNN" width={28} height={28} className="h-full w-full object-cover" />
            </div>
          </a>
        </div>
        <div className="mb-2 h-px w-full flex-shrink-0 bg-white/10" />
        <div className="flex-1 min-h-0 overflow-hidden pb-3">
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {NEWS_ITEMS.map((item, idx) => (
              <div key={idx} className="h-full w-full flex-shrink-0 px-1">
                <div className="flex h-full flex-col justify-between px-4 py-3">
                  <p className="flex-1 text-[0.95rem] leading-snug text-neutral-100 md:text-[1.15rem] md:leading-relaxed">
                    {item}
                  </p>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-end text-[1rem] text-neutral-500">
                    <span>{idx + 1}/{NEWS_ITEMS.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BentoCard>
  );
});

// Marquee with lazy initialization
const UpcomingRoadmapCard = memo(function UpcomingRoadmapCard({ className }: { className?: string }) {
  const [tokens, setTokens] = useState<MarqueeToken[]>([]);

  useEffect(() => {
    // Lazy load tokens
    setTokens(getMarqueeTokens());
  }, []);

  if (tokens.length === 0) {
    return <BentoCard className={className} placeholder="Loading..." />;
  }

  return (
    <BentoCard className={className}>
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-neutral-300">
            Pushing Limits
          </span>
          <span className="text-[0.6rem] text-neutral-500">leading the way</span>
        </div>
        <div className="mb-2 h-px w-full bg-white/10" />
        <div className="flex flex-1 items-center">
          <div className="relative left-[-1rem] w-[calc(100%+2rem)]">
            <FastMarquee gradient={false} speed={40} pauseOnHover>
              {tokens.map((token) => (
                <MarqueeCard key={token.id} token={token} className="mr-3" />
              ))}
            </FastMarquee>
          </div>
        </div>
      </div>
    </BentoCard>
  );
});

// Token Item - Memoized
const TokenItem = memo(function TokenItem({ token }: { token: BagsToken }) {
  const rawLinks = token.links ?? {};
  const displayLinks = Object.entries(rawLinks).filter(
    ([key, url]) =>
      key.toLowerCase() !== "image" &&
      typeof url === "string" &&
      url.startsWith("http")
  );

  const prettyLabel = (key: string) => {
    const k = key.toLowerCase();
    if (k === "external_url" || k === "website") return "site";
    if (k === "twitter" || k === "x") return "twitter";
    if (k === "telegram") return "tg";
    if (k === "discord") return "discord";
    return key;
  };

  return (
    <li className="rounded-xl bg-white/5 px-3 py-2">
      <div className="flex h-14 items-center gap-3">
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-black/40">
          {token.image ? (
            <img src={token.image} alt={token.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[0.7rem] text-neutral-300">
              {token.symbol?.slice(0, 3) || "BAG"}
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[0.9rem] text-white">{token.name}</span>
          <span className="text-[0.7rem] text-neutral-400">
            {token.symbol
              ? `${token.symbol} · ${token.mint.slice(0, 4)}…${token.mint.slice(-4)}`
              : token.mint.slice(0, 6) + "…" + token.mint.slice(-4)}
          </span>
        </div>
        <a
          href={`https://bags.fm/${token.mint}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 flex h-8 w-8 flex-shrink-0 items-center justify-center text-[1rem] text-neutral-400 hover:text-white"
        >
          <FiGlobe className="h-6 w-6" />
        </a>
      </div>
      {displayLinks.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5 pl-12">
          {displayLinks.slice(0, 4).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 bg-black/30 px-2 py-[2px] text-[0.6rem] text-neutral-100 hover:bg-white/10 hover:text-white"
            >
              {prettyLabel(key)}
            </a>
          ))}
        </div>
      )}
    </li>
  );
});

// Bags Tokens with better fetch handling
const BagsTokensCard = memo(function BagsTokensCard({ className }: { className?: string }) {
  const [tokens, setTokens] = useState<BagsToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      // Abort previous request if still pending
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        const res = await fetch("/api/bags/new-tokens", {
          method: "GET",
          cache: "no-store",
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setTokens(json.tokens ?? []);
        setError(null);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err?.message ?? "Failed to load");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
    const id = setInterval(fetchTokens, 60_000);

    return () => {
      clearInterval(id);
      abortControllerRef.current?.abort();
    };
  }, []);

  return (
    <BentoCard className={className} noPaddingBottom>
      <div className="flex h-full flex-col">
        <div className="mb-2 flex flex-shrink-0 items-center justify-between gap-2">
          <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-neutral-300">
            New Coins
          </span>
          <span className="text-[0.6rem] text-neutral-500">
            {loading ? "syncing…" : "updates every minute"}
          </span>
        </div>
        <div className="mb-2 h-px w-full flex-shrink-0 bg-white/10" />

        {error && <p className="mb-2 flex-shrink-0 text-[0.65rem] text-red-400">{error}</p>}

        {!error && loading && (
          <ul className="flex-1 min-h-0 space-y-3 overflow-y-auto pb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="rounded-xl bg-white/5 px-3 py-2">
                <div className="flex h-14 items-center gap-3">
                  <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-xl bg-white/10" />
                  <div className="flex min-w-0 flex-1 flex-col space-y-2">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && !error && tokens.length === 0 && (
          <p className="mt-2 text-[0.65rem] text-neutral-400">No tokens right now.</p>
        )}

        {!loading && !error && tokens.length > 0 && (
          <ul className="flex-1 min-h-0 space-y-3 overflow-y-auto pb-3">
            {tokens.map((t) => (
              <TokenItem key={t.mint} token={t} />
            ))}
          </ul>
        )}
      </div>
    </BentoCard>
  );
});

// ============ MAIN COMPONENT ============

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <VideoBackground />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-6">
        <div className="relative h-full w-full">
          {/* Bento grid – only on lg+ */}
          <div className="hidden h-full w-full grid-cols-6 grid-rows-4 gap-4 lg:grid">
            <AudioBento className="col-start-1 col-span-2 row-start-1" />
            <EarningsBento className="col-start-3 col-span-1 row-start-1" />
            <XFeedBento className="col-start-4 col-span-3 row-start-1 overflow-x-hidden" />
            <BentoCard className="col-start-1 row-start-2 row-span-2" placeholder="[ create ]" />
            <BentoCard className="col-start-2 row-start-2" placeholder="[ connect ]" />
            <BentoCard className="col-start-2 row-start-3" placeholder="[ trade ]" />
            <BagsTokensCard className="col-start-5 col-span-2 row-start-2 row-span-2" />
            <NewsBento className="col-start-1 col-span-3 row-start-4" />
            <UpcomingRoadmapCard className="col-start-4 col-span-3 row-start-4" />
          </div>

          {/* Center hero overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <Image src="/bags.png" alt="Bags logo" width={64} height={64} className="h-12 w-12 md:h-14 md:w-14" priority />

            <div className="relative inline-block">
              <h1 className="whitespace-nowrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight">
                <span>Fund Better.</span>
                <span className="absolute top-0 md:top-0 -right-2 md:-right-2 text-base md:text-2xl leading-none">™</span>
              </h1>
            </div>

            <p className="-mt-3 text-xs sm:text-sm md:text-base text-neutral-200">
              Raise money from the internet
            </p>

            <div className="pointer-events-auto mt-3">
              <ShinyButton />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}