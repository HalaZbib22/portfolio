"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import { Panel } from "./Panel";
import { MochiSprite, MOCHI_H, MOCHI_W } from "./MochiSprite";
import { CAT_NAME, type Light } from "@/lib/content";

const PX = 3;
const CAT_W = MOCHI_W * PX;
const CAT_H = MOCHI_H * PX;
const CATCH_RADIUS = 14;
const SPEED = 1.6;
const ZOOMIES_SPEED = 5;
const BEST_KEY = "hz-mochi-best";

type Vec = { x: number; y: number };
type LogLine = { t: string; text: string; tone?: "ok" | "warn" | "accent" };
type Care = Record<string, Light>;

const IDLE_LINES = [
  "sat on the keyboard",
  "knocked a mug off the desk",
  "stared at the wall for no reason",
  "napped on the warm laptop",
  "chirped at a pigeon",
  "demanded dinner · 3 hours early",
  "walked across the standup call",
];
const pad = (n: number) => String(n).padStart(2, "0");

// best score: a per-visitor convenience in localStorage, exposed as an external store
const bestListeners = new Set<() => void>();
const readBest = () => { try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; } };
const writeBest = (n: number) => { try { localStorage.setItem(BEST_KEY, String(n)); } catch {} bestListeners.forEach((l) => l()); };
const subscribeBest = (cb: () => void) => { bestListeners.add(cb); window.addEventListener("storage", cb); return () => { bestListeners.delete(cb); window.removeEventListener("storage", cb); }; };
const now = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * MOCHI.SYS — the one looping tile on the page. Move the pointer over the floor and the laser dot follows;
 * Mochi chases it. Catches count. When you leave, the dot wanders on its own and she keeps hunting.
 * Positions are written straight to the DOM each frame; React state only carries score, log and mood.
 */
export function MochiTile({ zoomiesKey }: { zoomiesKey: number }) {
  const arena = useRef<HTMLDivElement>(null);
  const catEl = useRef<HTMLDivElement>(null);
  const dotEl = useRef<HTMLDivElement>(null);
  const sim = useRef({ cat: { x: 40, y: 90 } as Vec, dot: { x: 200, y: 60 } as Vec, target: null as Vec | null, facing: 1, wanderAt: 0, zoomiesUntil: 0, napping: false, step: 0 });
  const [caught, setCaught] = useState(0);
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);
  const [nappingState, setNapping] = useState(false);
  const [seenZoomies, setSeenZoomies] = useState(0);
  const zoomies = zoomiesKey > seenZoomies; // derived: on until the run is acknowledged below
  const napping = nappingState && !zoomies;
  const [clock, setClock] = useState("--:--:--");
  const [log, setLog] = useState<LogLine[]>([]);
  const [care, setCare] = useState<Care>({ "FOOD BOWL": "ok", WATER: "ok", "LASER BATTERY": "ok" });

  const pushLog = useCallback((text: string, tone?: LogLine["tone"]) => {
    setLog((l) => [{ t: now(), text, tone }, ...l].slice(0, 5));
  }, []);

  const caughtRef = useRef(0);
  const recordCatch = useCallback((text: string) => {
    caughtRef.current += 1;
    setCaught(caughtRef.current);
    if (caughtRef.current > readBest()) writeBest(caughtRef.current);
    pushLog(text, "accent");
  }, [pushLog]);

  // clock + idle diary
  useEffect(() => {
    const tick = () => { const d = new Date(); setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`); };
    tick();
    const c = setInterval(tick, 1000);
    const seed = [...IDLE_LINES].sort(() => Math.random() - 0.5).slice(0, 3);
    seed.forEach((text) => pushLog(text));
    const diary = setInterval(() => pushLog(IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)]), 14000);
    return () => { clearInterval(c); clearInterval(diary); };
  }, [pushLog]);

  // easter egg: zoomies, 5s, then acknowledged
  useEffect(() => {
    if (!zoomies) return;
    sim.current.zoomiesUntil = performance.now() + 5000;
    sim.current.napping = false;
    const t0 = setTimeout(() => pushLog("ZOOMIES · 3am energy at " + now(), "warn"), 0);
    const t = setTimeout(() => { setSeenZoomies(zoomiesKey); setNapping(false); pushLog("collapsed on the rug", "ok"); }, 5000);
    return () => { clearTimeout(t0); clearTimeout(t); };
  }, [zoomies, zoomiesKey, pushLog]);

  // the loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const frame = (t: number) => {
      const dt = Math.min(2, (t - last) / 16.67);
      last = t;
      const s = sim.current;
      const el = arena.current;
      if (el) {
        const W = el.clientWidth;
        const H = el.clientHeight;
        // dot: follow the pointer, or wander
        if (s.target) {
          s.dot.x += (s.target.x - s.dot.x) * 0.25 * dt;
          s.dot.y += (s.target.y - s.dot.y) * 0.25 * dt;
        } else if (t > s.wanderAt) {
          s.wanderAt = t + rnd(1800, 3600);
          s.target = null;
          s.dot = { x: rnd(16, W - 16), y: rnd(16, H - 16) };
        }
        // cat: chase unless napping
        const z = t < s.zoomiesUntil;
        if (!s.napping) {
          const cx = s.cat.x, cy = s.cat.y;
          const dx = s.dot.x - cx, dy = s.dot.y - cy;
          const d = Math.hypot(dx, dy);
          const v = (z ? ZOOMIES_SPEED : SPEED) * dt;
          if (d > CATCH_RADIUS) {
            s.cat.x += (dx / d) * v;
            s.cat.y += (dy / d) * v;
            if (Math.abs(dx) > 2) s.facing = dx < 0 ? -1 : 1;
            s.step += v;
          } else {
            // caught: the dot jumps somewhere else; if the pointer was holding it, it slips free
            recordCatch(z ? "caught it mid-zoomie" : "caught the dot");
            s.target = null;
            s.dot = { x: rnd(16, W - 16), y: rnd(16, H - 16) };
            s.wanderAt = t + rnd(1800, 3600);
          }
          s.cat.x = Math.max(CAT_W / 2, Math.min(W - CAT_W / 2, s.cat.x));
          s.cat.y = Math.max(CAT_H / 2, Math.min(H - CAT_H / 2, s.cat.y));
        }
        if (catEl.current) {
          const bob = s.napping ? 0 : Math.round(Math.sin(s.step / 6)) * 1;
          catEl.current.style.transform = `translate(${(s.cat.x - CAT_W / 2).toFixed(1)}px,${(s.cat.y - CAT_H / 2 + bob).toFixed(1)}px) scaleX(${s.facing})`;
        }
        if (dotEl.current) dotEl.current.style.transform = `translate(${s.dot.x.toFixed(1)}px,${s.dot.y.toFixed(1)}px)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [recordCatch]);

  const onPointer = (e: ReactPointerEvent) => {
    const r = arena.current!.getBoundingClientRect();
    sim.current.target = { x: Math.max(8, Math.min(r.width - 8, e.clientX - r.left)), y: Math.max(8, Math.min(r.height - 8, e.clientY - r.top)) };
  };
  const onLeave = () => { sim.current.target = null; sim.current.wanderAt = performance.now() + 1200; };

  const toggleNap = () => {
    const n = !sim.current.napping;
    sim.current.napping = n;
    setNapping(n);
    pushLog(n ? "curled up · do not disturb" : "awake and judging you", n ? "ok" : undefined);
  };
  const cycle = (name: string) => {
    const next: Light = care[name] === "ok" ? "warn" : care[name] === "warn" ? "down" : "ok";
    setCare({ ...care, [name]: next });
    const n = name.toLowerCase();
    pushLog(next === "ok" ? `${n} refilled` : next === "warn" ? `${n} getting low` : `${n} EMPTY · meowing`, next === "ok" ? "ok" : "warn");
  };

  const anyDown = Object.values(care).includes("down");
  const anyWarn = Object.values(care).includes("warn");
  const light: Light = zoomies ? "warn" : anyDown ? "down" : anyWarn ? "warn" : "ok";
  const state = zoomies ? "ZOOMIES" : napping ? "NAPPING" : anyDown ? "MEOWING" : anyWarn ? "SIDE-EYE" : "ON PATROL";

  return (
    <Panel panel="live" index={1} tab="">
      <div className="live-head">
        <span className="tag-l">LIVE · {CAT_NAME}.SYS</span>
        <span className="hub"><span className="light" data-light={light} />{state}</span>
      </div>
      <div className="clock-row">
        <span className="clock" title="dots caught this visit">{String(caught).padStart(3, "0")}<span className="clock-unit"> caught</span></span>
        <span className="drift">best <b>{String(best).padStart(3, "0")}</b> · {clock}</span>
      </div>
      <div ref={arena} className="arena" data-mood={zoomies ? "zoomies" : napping ? "asleep" : "idle"} onPointerMove={onPointer} onPointerDown={onPointer} onPointerLeave={onLeave} aria-label={`${CAT_NAME} chasing a laser dot`}>
        <div className="vl" style={{ left: "25%" }} /><div className="vl" style={{ left: "50%" }} /><div className="vl" style={{ left: "75%" }} />
        <div className="hl" style={{ top: "33%" }} /><div className="hl" style={{ top: "66%" }} />
        <div ref={dotEl} className="laser" />
        <div ref={catEl} className="cat cat-run"><MochiSprite px={PX} /></div>
        <span className="readout l">move the pointer · she follows</span>
        <span className="readout r">{napping ? "zzz" : "hunting"}</span>
      </div>
      <div className="feed-head">
        <span>activity log · {CAT_NAME.toLowerCase()}</span>
        <button className="btn-mini" onClick={toggleNap}>{napping ? "▶ wake" : "❚❚ nap"}</button>
      </div>
      <div className="feed" aria-live="off">
        {log.map((l, i) => (
          <div key={`${l.t}-${i}-${l.text}`} className="order">
            <span className="id">{l.t}</span>
            <span className="kind" data-tone={l.tone}>{l.text}</span>
          </div>
        ))}
      </div>
      <div className="lights">
        {Object.entries(care).map(([name, s]) => (
          <button key={name} onClick={() => cycle(name)} title="click to change state">
            <span className="light" data-light={s} />{name}
          </button>
        ))}
      </div>
    </Panel>
  );
}
