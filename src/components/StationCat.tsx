"use client";

import { useEffect, useRef, useState } from "react";
import { CAT_NAME } from "@/lib/content";

import { MochiSprite } from "./MochiSprite";

const PX = 2;
const SLEEP_AFTER = 40_000;

/** zoomiesKey increments on the easter egg; the cat goes on alert for a few seconds. */
export function StationCat({ zoomiesKey: rushKey }: { zoomiesKey: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const [dozing, setDozing] = useState(false);
  const [seenRush, setSeenRush] = useState(0);
  const alert = rushKey > seenRush; // derived: on alert until the rush is acknowledged below
  const asleep = dozing && !alert;
  const [talk, setTalk] = useState<string | null>(null);

  // eyes follow the pointer (direct DOM write), and the cat dozes off when nothing moves
  useEffect(() => {
    let sleepTimer = window.setTimeout(() => setDozing(true), SLEEP_AFTER);
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      const eyes = eyesRef.current;
      if (!el || !eyes) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.3);
      const d = Math.max(1, Math.hypot(dx, dy));
      const k = Math.min(1, d / 240) * PX * 0.9;
      eyes.style.transform = `translate(${((dx / d) * k).toFixed(2)}px,${((dy / d) * k).toFixed(2)}px)`;
      setDozing(false);
      window.clearTimeout(sleepTimer);
      sleepTimer = window.setTimeout(() => setDozing(true), SLEEP_AFTER);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); window.clearTimeout(sleepTimer); };
  }, []);

  // the alert lasts 4.5s after each rush, then is acknowledged
  useEffect(() => {
    if (!alert) return;
    const t = window.setTimeout(() => setSeenRush(rushKey), 4500);
    return () => window.clearTimeout(t);
  }, [alert, rushKey]);

  const poke = () => {
    setDozing(false);
    setTalk(alert ? "!!" : asleep ? "mrrp?" : "mrrp");
    window.setTimeout(() => setTalk(null), 1200);
  };

  const mood = alert ? "alert" : asleep ? "asleep" : "idle";
  return (
    <div ref={ref} className="cat" data-mood={mood} title={`${CAT_NAME} · sidekick`}>
      {talk && <span className="cat-say">{talk}</span>}
      {asleep && !talk && <span className="cat-zzz" aria-hidden>z</span>}
      <button className="cat-hit" onClick={poke} aria-label={`${CAT_NAME}, the sidekick`}>
        <MochiSprite px={PX} eyesRef={eyesRef} />
      </button>
    </div>
  );
}
