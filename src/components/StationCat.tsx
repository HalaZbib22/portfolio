"use client";

import { useEffect, useRef, useState } from "react";
import { CAT_NAME } from "@/lib/content";

/*
 * Pixel grid, 18 × 13, drawn from photos of the real Mochi (a lynx-point):
 * c = cream fur, m = taupe mask / ears / forehead stripes, e = blue eye, n = pink nose, t = tail (darker tip, own group so it can sway).
 */
const SPRITE = [
  "...m.........m....",
  "...mm.......mm....",
  "...mmcccccccmm....",
  "..cmcmccmccmcmc...",
  "..cccceccccecccc..",
  "..ccmmcccnccmmcc..",
  "...cccccmcccccc...",
  "..cccccccccccccc..",
  ".cccccccccccccccc.",
  ".ccccccccccccccccc",
  ".cccccccccccccctt.",
  ".ccccccccccccctt..",
  ".cc.ccc.....ccc.c.",
];
const PX = 3;
const W = SPRITE[0].length * PX;
const H = SPRITE.length * PX;

type Cell = { x: number; y: number };
const cells = (ch: string): Cell[] =>
  SPRITE.flatMap((row, y) => [...row].map((c, x) => (c === ch ? { x, y } : null)).filter((c): c is Cell => c !== null));
const CREAM = cells("c");
const MASK = cells("m");
const EYES = cells("e");
const NOSE = cells("n");
const TAIL = cells("t");

const SLEEP_AFTER = 40_000;

/** rushKey increments on the order-rush easter egg; the cat goes on alert for a few seconds. */
export function StationCat({ rushKey }: { rushKey: number }) {
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
      const k = Math.min(1, d / 240) * PX * 0.6;
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
    <div ref={ref} className="cat" data-mood={mood} title={`${CAT_NAME} · station cat`}>
      {talk && <span className="cat-say">{talk}</span>}
      {asleep && !talk && <span className="cat-zzz" aria-hidden>z</span>}
      <button className="cat-hit" onClick={poke} aria-label={`${CAT_NAME}, the station cat`}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" aria-hidden>
          <g className="cat-tail">
            {TAIL.map((c) => <rect key={`t${c.x}-${c.y}`} x={c.x * PX} y={c.y * PX} width={PX} height={PX} />)}
          </g>
          <g className="cat-fur">
            {CREAM.map((c) => <rect key={`c${c.x}-${c.y}`} x={c.x * PX} y={c.y * PX} width={PX} height={PX} />)}
          </g>
          <g className="cat-mask">
            {MASK.map((c) => <rect key={`m${c.x}-${c.y}`} x={c.x * PX} y={c.y * PX} width={PX} height={PX} />)}
            {NOSE.map((c) => <rect key={`n${c.x}-${c.y}`} className="cat-nose" x={c.x * PX} y={c.y * PX} width={PX} height={PX} />)}
          </g>
          <g ref={eyesRef} className="cat-look">
            <g className="cat-eyes">
              {EYES.map((c) => <rect key={`e${c.x}-${c.y}`} x={c.x * PX} y={c.y * PX} width={PX} height={PX} />)}
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
