"use client";

import { useEffect, useRef } from "react";
import { Panel } from "./Panel";
import { EXPERIENCE } from "@/lib/content";

export function ShiftLog() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // scroll-linked progress marker, written straight to a CSS variable (no re-render)
  useEffect(() => {
    let last = -1;
    const onScroll = () => {
      const el = ref.current;
      const t = track.current;
      if (!el || !t) return;
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.55 - r.top) / r.height));
      if (Math.abs(p - last) > 0.005) {
        last = p;
        t.style.setProperty("--p", `${(p * 100).toFixed(1)}%`);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return (
    <Panel ref={ref} id="s2" panel="shift" index={2} tab="02 · CAMPAIGN" right="WORK HISTORY · NEWEST FIRST">
      <div className="shift">
        <div className="track" ref={track}><div className="fill" /><div className="marker" /></div>
        <div className="rows">
          {EXPERIENCE.map((e) => (
            <div key={e.company} className="row" tabIndex={0}>
              <div className="shift-grid">
                <span className="co">{e.company}</span>
                <span className="role">{e.role}</span>
                <span className="dates">{e.dates}</span>
                <span className="city">{e.city}</span>
              </div>
              <div className="tele-row"><div className="tele-text"><span className="k">▸ CHAPTER</span>{e.highlight}</div></div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
