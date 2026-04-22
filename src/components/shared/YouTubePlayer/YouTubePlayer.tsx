"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Play } from "lucide-react";

/**
 * Shared YouTube lesson player.
 *
 * We embed YouTube via the iframe + JS API (not a plain `<iframe src>`) so
 * we can listen to `onStateChange` events and mark a lesson as complete
 * only after the student watches the video to the end. Key rules:
 *
 *  - "Completed" fires exactly once per mount, the first time either
 *     a) the video emits `YT.PlayerState.ENDED`, **or**
 *     b) the current time crosses 95% of the reported duration (safety net
 *        in case YouTube coalesces the `ENDED` event on mobile).
 *  - We keep a visible progress bar in sync with the playhead so the
 *    student can see their completion gate filling up.
 *  - Autoplay is disabled — the student must tap play themselves.
 */

interface YouTubePlayerProps {
  /** YouTube video id or full URL (e.g. https://youtu.be/abc). */
  videoUrl: string;
  /** Optional initial completion state (e.g. from saved progress). */
  initialCompleted?: boolean;
  /** Fires the first time the student watches >=95% of the video. */
  onCompleted?: () => void;
  /** Rendered below the player — typically the lesson title or duration. */
  caption?: string;
  className?: string;
}

const YT_SCRIPT_ID = "youtube-iframe-api";
let ytReadyPromise: Promise<void> | null = null;

/**
 * Load the IFrame API exactly once per session. YouTube's bootstrap expects
 * a global `onYouTubeIframeAPIReady` — we chain additional subscribers on top
 * of it so multiple players don't stomp on each other.
 */
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (ytReadyPromise) return ytReadyPromise;

  ytReadyPromise = new Promise<void>((resolve) => {
    const w = window as unknown as {
      YT?: { Player: unknown };
      onYouTubeIframeAPIReady?: () => void;
    };

    if (w.YT && w.YT.Player) {
      resolve();
      return;
    }

    const existing = document.getElementById(YT_SCRIPT_ID);
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };

    if (!existing) {
      const script = document.createElement("script");
      script.id = YT_SCRIPT_ID;
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return ytReadyPromise;
}

/** Extract the video id from the ~5 common YouTube URL shapes we care about. */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const direct = input.match(/^[\w-]{11}$/);
  if (direct) return input;
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1) || null;
    }
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const m = url.pathname.match(/\/embed\/([\w-]{11})/);
      if (m) return m[1];
    }
  } catch {
    // Fall through to null — let the UI render a helpful error.
  }
  return null;
}

export default function YouTubePlayer({
  videoUrl,
  initialCompleted = false,
  onCompleted,
  caption,
  className = "",
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<{
    destroy?: () => void;
    getDuration?: () => number;
    getCurrentTime?: () => number;
    getPlayerState?: () => number;
  } | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(initialCompleted);

  const [progressPct, setProgressPct] = useState(initialCompleted ? 100 : 0);
  const [playerReady, setPlayerReady] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [hasError, setHasError] = useState(false);

  const videoId = extractYouTubeId(videoUrl);

  const markCompleted = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIsCompleted(true);
    setProgressPct(100);
    onCompleted?.();
  }, [onCompleted]);

  // Poll the playhead every 750ms while the video is playing. This powers
  // both the progress bar and the ">=95% watched" completion gate.
  useEffect(() => {
    if (!playerReady) return;
    if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);

    pollTimerRef.current = window.setInterval(() => {
      const p = playerRef.current;
      if (!p || !p.getDuration || !p.getCurrentTime) return;
      const duration = p.getDuration();
      const current = p.getCurrentTime();
      if (!duration || duration <= 0) return;

      const pct = Math.min(100, Math.round((current / duration) * 100));
      setProgressPct((prev) => (pct > prev ? pct : prev));
      if (pct >= 95) markCompleted();
    }, 750);

    return () => {
      if (pollTimerRef.current) {
        window.clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [playerReady, markCompleted]);

  useEffect(() => {
    if (!videoId) {
      setHasError(true);
      return;
    }

    let cancelled = false;
    loadYouTubeApi()
      .then(() => {
        if (cancelled) return;
        const w = window as unknown as {
          YT: {
            Player: new (
              el: HTMLElement,
              config: Record<string, unknown>,
            ) => unknown;
            PlayerState: { ENDED: number };
          };
        };
        if (!containerRef.current) return;

        playerRef.current = new w.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onReady: () => {
              if (!cancelled) setPlayerReady(true);
            },
            onStateChange: (event: { data: number }) => {
              if (event.data === w.YT.PlayerState.ENDED) {
                markCompleted();
              }
            },
            onError: () => {
              setHasError(true);
            },
          },
        }) as typeof playerRef.current;
      })
      .catch(() => setHasError(true));

    return () => {
      cancelled = true;
      if (pollTimerRef.current) {
        window.clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // YouTube sometimes throws on re-init during HMR — safe to ignore.
        }
      }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  if (!videoId || hasError) {
    return (
      <div
        className={`w-full aspect-video bg-surface-300 rounded-lg border border-border-default flex items-center justify-center ${className}`}
      >
        <div className="flex flex-col items-center gap-2 text-center px-6">
          <div className="size-12 rounded-full bg-surface-400 border border-border-default flex items-center justify-center">
            <Play size={20} className="text-white ml-0.5" />
          </div>
          <p className="text-[#A1A1AA] text-xs">
            Video unavailable. Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border-default bg-black">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-surface-300 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isCompleted ? "bg-accent-primary" : "bg-white/70"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {isCompleted ? (
          <span className="flex items-center gap-1 text-accent-primary text-[11px] font-semibold whitespace-nowrap">
            <CheckCircle2 size={12} /> Completed
          </span>
        ) : (
          <span className="text-[#A1A1AA] text-[11px] font-semibold whitespace-nowrap">
            {progressPct}% watched
          </span>
        )}
      </div>

      {caption && (
        <p className="text-[#A1A1AA] text-xs">{caption}</p>
      )}
      {!isCompleted && (
        <p className="text-[11px] text-[#A1A1AA]">
          Tip: the lesson will only unlock its chapter quiz and test once you
          watch the video to the end.
        </p>
      )}
    </div>
  );
}
