"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Panel } from "./Panel";
import type { Light } from "@/lib/content";

const ROUTE: [number, number][] = [[12, 75], [12, 25], [45, 25], [45, 75], [80, 75], [80, 25], [45, 25], [45, 50], [12, 50]];
const KINDS = ["GROCERY", "RESTAURANT", "GROCERY", "GROCERY", "RESTAURANT"];
const STATUS = ["NEW", "PICKING", "ON ROUTE", "DELIVERED"] as const;
type Status = (typeof STATUS)[number] | "RUSH";
const SCOLOR: Record<Status, string> = {
  NEW: "var(--accent)",
  PICKING: "var(--warn)",
  "ON ROUTE": "var(--accent-2)",
  DELIVERED: "var(--ok)",
  RUSH: "var(--down)",
};
type Order = { id: string; kind: string; status: Status };
type Sim = { x: number; y: number; wp: number; manual: [number, number] | null };
type Lights = Record<string, Light>;

const nearestWp = (x: number, y: number) => {
  let bi = 0;
  let bd = Infinity;
  ROUTE.forEach(([px, py], i) => {
    const d = Math.hypot(px - x, py - y);
    if (d < bd) { bd = d; bi = i; }
  });
  return bi;
};

const stepSim = (s: Sim): Sim => {
  const [tx, ty] = s.manual ?? ROUTE[s.wp];
  const dx = tx - s.x;
  const dy = ty - s.y;
  const d = Math.hypot(dx, dy);
  if (d < 0.8) {
    return { x: tx, y: ty, manual: null, wp: s.manual ? nearestWp(tx, ty) : (s.wp + 1) % ROUTE.length };
  }
  const v = 0.7;
  return { ...s, x: s.x + (dx / d) * v, y: s.y + (dy / d) * v };
};

const pad = (n: number) => String(n).padStart(2, "0");

/** rushKey increments each time the operator types the four-letter word. */
export function LiveTile({ rushKey }: { rushKey: number }) {
  const [clock, setClock] = useState("--:--:--");
  const [drift, setDrift] = useState("+0ms");
  const [orders, setOrders] = useState<Order[]>([]);
  const [paused, setPaused] = useState(false);
  const [sim, setSim] = useState<Sim>({ x: 12, y: 75, wp: 1, manual: null });
  const [dragging, setDragging] = useState(false);
  const [lights, setLights] = useState<Lights>({ SIGNALR: "ok", FIRESTORE: "ok", "GRPC MESH": "ok" });
  const [rush, setRush] = useState(0);
  const seq = useRef(4810);
  const draggingRef = useRef(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const pushOrder = useCallback((status: Status) => {
    const s = ++seq.current;
    const o: Order = { id: `#${s}`, kind: KINDS[s % KINDS.length], status };
    setOrders((prev) => [o, ...prev].slice(0, 5));
  }, []);

  // clock, driver, feed
  useEffect(() => {
    for (let i = 0; i < 4; i++) pushOrder(STATUS[3 - i]);
    const tickClock = () => {
      const d = new Date();
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
      setDrift(`+${d.getSeconds() % 3}ms`);
    };
    tickClock();
    const c = setInterval(tickClock, 1000);
    const m = setInterval(() => { if (!draggingRef.current) setSim(stepSim); }, 60);
    return () => { clearInterval(c); clearInterval(m); };
  }, [pushOrder]);

  useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          const i = STATUS.indexOf(o.status as (typeof STATUS)[number]);
          const ns: Status = o.status === "RUSH" ? "PICKING" : STATUS[Math.min(3, i + 1)];
          return { ...o, status: ns };
        }),
      );
      pushOrder("NEW");
    }, 2500);
    return () => clearInterval(iv);
  }, [paused, pushOrder]);

  // order rush easter egg
  useEffect(() => {
    if (!rushKey) return;
    let n = 0;
    const iv = setInterval(() => {
      pushOrder("RUSH");
      n++;
      setRush(n);
      if (n >= 12) {
        clearInterval(iv);
        setTimeout(() => setRush(0), 2500);
      }
    }, 160);
    return () => clearInterval(iv);
  }, [rushKey, pushOrder]);

  const dragStart = (e: ReactPointerEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    setDragging(true);
    const map = mapRef.current!;
    const move = (ev: PointerEvent) => {
      const r = map.getBoundingClientRect();
      setSim((s) => ({
        ...s,
        x: Math.max(2, Math.min(98, ((ev.clientX - r.left) / r.width) * 100)),
        y: Math.max(4, Math.min(96, ((ev.clientY - r.top) / r.height) * 100)),
      }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      draggingRef.current = false;
      setDragging(false);
      setSim((s) => ({ ...s, manual: ROUTE[nearestWp(s.x, s.y)] }));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const cycle = (name: string) =>
    setLights((l) => ({ ...l, [name]: l[name] === "ok" ? "warn" : l[name] === "warn" ? "down" : "ok" }));

  const anyDown = Object.values(lights).includes("down");
  const anyWarn = Object.values(lights).includes("warn");
  const hubLight: Light = rush ? "warn" : anyDown ? "down" : anyWarn ? "warn" : "ok";
  const hubState = rush ? "ORDER RUSH" : anyDown ? "DEGRADED" : anyWarn ? "WATCH" : "CONNECTED";
  const hint = sim.manual ? "REROUTING" : dragging ? "MANUAL" : "ON ROUTE";

  return (
    <Panel panel="live" index={1} tab="">
      <div className="live-head">
        <span className="tag-l">LIVE · DISPATCH BOARD</span>
        <span className="hub"><span className="light" data-light={hubLight} />{hubState}</span>
      </div>
      <div className="clock-row">
        <span className="clock">{clock}</span>
        <span className="drift">server offset <b>{drift}</b></span>
      </div>
      <div ref={mapRef} className="map" aria-label="Driver map">
        <div className="vl" style={{ left: "12%" }} /><div className="vl" style={{ left: "45%" }} /><div className="vl" style={{ left: "80%" }} />
        <div className="hl" style={{ top: "25%" }} /><div className="hl" style={{ top: "50%" }} /><div className="hl" style={{ top: "75%" }} />
        <div className="hub-pin" /><span className="hub-label">HUB</span>
        <span className="readout l">DRV-07 · {pad(Math.round(sim.x))},{pad(Math.round(sim.y))}</span>
        <span className="readout r">{hint}</span>
        <div className="driver" style={{ left: `${sim.x.toFixed(1)}%`, top: `${sim.y.toFixed(1)}%` }} onPointerDown={dragStart} title="drag the driver">
          <span className="ring" /><span className="dot" />
        </div>
      </div>
      <div className="feed-head">
        <span>{rush ? `inbound · ${rush} orders in 2s` : "order feed · signalr"}</span>
        <button className="btn-mini" onClick={() => setPaused((p) => !p)}>{paused ? "▶ resume" : "❚❚ pause"}</button>
      </div>
      <div className="feed" aria-live="off">
        {orders.map((o) => (
          <div key={o.id} className="order">
            <span className="id">{o.id}</span>
            <span className="kind">{o.kind}</span>
            <span className="st" style={{ color: SCOLOR[o.status] }}>{o.status}</span>
          </div>
        ))}
      </div>
      <div className="lights">
        {Object.entries(lights).map(([name, state]) => (
          <button key={name} onClick={() => cycle(name)} title="click to change state">
            <span className="light" data-light={state} />{name}
          </button>
        ))}
      </div>
    </Panel>
  );
}
