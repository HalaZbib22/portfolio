"use client";

import { useEffect, useState } from "react";
import { FLAP } from "@/lib/content";

/**
 * Split-flap hero resolve: 60ms steps, letter i settles at 400 + i*90 ms,
 * so a nine-glyph name lands in under 1.3s. Runs once, never replays.
 * With reduced motion the final name renders immediately.
 */
export function useSplitFlap(text: string, reduced: boolean) {
  const [flapping, setFlapping] = useState<string[]>(() => text.split("").map((c) => (c === " " ? " " : "·")));
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const t0 = performance.now();
    const iv = setInterval(() => {
      const t = performance.now() - t0;
      let allSettled = true;
      const next = text.split("").map((c, i) => {
        if (c === " ") return " ";
        if (t > 400 + i * 90) return c;
        allSettled = false;
        return FLAP[Math.floor(Math.random() * FLAP.length)];
      });
      setFlapping(next);
      if (allSettled) {
        setSettled(true);
        clearInterval(iv);
      }
    }, 60);
    return () => clearInterval(iv);
  }, [text, reduced]);

  const done = reduced || settled;
  return { chars: done ? text.split("") : flapping, done };
}
