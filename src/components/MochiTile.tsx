"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Panel } from "./Panel";
import { MochiSprite } from "./MochiSprite";
import { MOUSE, MOUSE_CLASSES, PixelArt, YARN, YARN_CLASSES } from "./PixelArt";
import { CAT_NAME, type Light } from "@/lib/content";
import { act, age, mood, readPet, serverPet, subscribePet, tick, updatePet, zoomies as doZoomies, type Action, type Pet, type Toy } from "@/lib/pet";

const PX = 3;
const TICK_MS = 5000;
type LogLine = { t: string; text: string; tone?: "ok" | "warn" | "accent" };

const pad = (n: number) => String(n).padStart(2, "0");
const stamp = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const level = (v: number) => (v < 25 ? "low" : v < 50 ? "mid" : "ok");
const MOOD_LIGHT: Record<string, Light> = { NAPPING: "ok", PURRING: "ok", CONTENT: "ok", HUNGRY: "down", SLEEPY: "warn", BORED: "warn", MESSY: "warn" };

/**
 * MOCHI.SYS — a Tamagotchi. Four stats decay in real time (also while you're away, capped at 12h) and persist per browser.
 * Feed, play, nap and clean. The model lives in lib/pet.ts; this component is only the LCD and the buttons.
 */
export function MochiTile({ zoomiesKey }: { zoomiesKey: number }) {
  const pet = useSyncExternalStore(subscribePet, readPet, serverPet);
  const [clock, setClock] = useState("--:--");
  const [ageText, setAgeText] = useState("--");
  const [say, setSay] = useState<string | null>(null);
  const [log, setLog] = useState<LogLine[]>([]);
  const [seenZoomies, setSeenZoomies] = useState(0);
  const zoomies = zoomiesKey > seenZoomies;
  const sayTimer = useRef(0);
  const [toy, setToy] = useState<{ kind: Toy; id: number } | null>(null);
  const toyTimer = useRef(0);
  const nextToy = useRef<Toy>("mouse");

  const pushLog = useCallback((text: string, tone?: LogLine["tone"]) => {
    setLog((l) => [{ t: stamp(), text, tone }, ...l].slice(0, 3));
  }, []);
  const speak = useCallback((s: string) => {
    setSay(s);
    window.clearTimeout(sayTimer.current);
    sayTimer.current = window.setTimeout(() => setSay(null), 1400);
  }, []);

  // real-time decay, clock, and a first log line about how she found you
  useEffect(() => {
    const first = readPet();
    const away = first.born ? Date.now() - first.last : 0;
    const t0 = window.setTimeout(() => {
      if (!first.born) pushLog(`hatched · ${CAT_NAME.toLowerCase()} is now your problem`, "accent");
      else if (away > 60 * 60 * 1000) pushLog(`you were gone ${Math.round(away / 3_600_000)}h · she noticed`, "warn");
      else pushLog("resumed · she pretends not to care", undefined);
    }, 0);
    const run = () => { const now = Date.now(); updatePet((p) => tick(p, now)); setClock(stamp()); setAgeText(age(readPet(), now)); };
    run();
    const iv = window.setInterval(run, TICK_MS);
    return () => { window.clearTimeout(t0); window.clearInterval(iv); };
  }, [pushLog]);

  // easter egg
  useEffect(() => {
    if (!zoomies) return;
    updatePet(doZoomies);
    const t0 = window.setTimeout(() => { speak("ZOOM"); pushLog("ZOOMIES · 3am energy, wall to wall", "warn"); }, 0);
    const t = window.setTimeout(() => { setSeenZoomies(zoomiesKey); pushLog("collapsed on the rug", "ok"); }, 5000);
    return () => { window.clearTimeout(t0); window.clearTimeout(t); };
  }, [zoomies, zoomiesKey, pushLog, speak]);

  const doAct = (a: Action) => {
    const kind = nextToy.current;
    const out = act(readPet(), a, kind);
    if (out.pet !== readPet()) updatePet(() => tick(out.pet, Date.now()));
    speak(out.say);
    pushLog(out.log, out.ok ? (a === "nap" ? "ok" : "accent") : "warn");
    if (a === "play" && out.ok) {
      nextToy.current = kind === "mouse" ? "yarn" : "mouse"; // alternate toys
      setToy({ kind, id: Date.now() });
      window.clearTimeout(toyTimer.current);
      toyTimer.current = window.setTimeout(() => setToy(null), 2600);
    }
  };

  const m = mood(pet);
  const lcdMood = zoomies ? "zoomies" : toy ? "play" : pet.asleep ? "asleep" : m === "HUNGRY" || m === "BORED" ? "sulk" : "idle";
  const stats: [string, keyof Pet][] = [["food", "food"], ["energy", "energy"], ["fun", "fun"], ["litter", "clean"]];

  return (
    <Panel panel="live" index={1} tab="">
      <div className="live-head">
        <span className="tag-l">LIVE · {CAT_NAME}.SYS</span>
        <span className="hub"><span className="light" data-light={zoomies ? "warn" : MOOD_LIGHT[m]} />{zoomies ? "ZOOMIES" : m}</span>
      </div>
      <div className="lcd" data-mood={lcdMood} aria-label={`${CAT_NAME}, a virtual pet. Mood: ${m}`}>
        <span className="pix tl">AGE {ageText}</span>
        <span className="pix tr">{clock}</span>
        <div className="cat pet">
          {(say || pet.asleep) && <span className="cat-say">{say ?? "zzz"}</span>}
          <MochiSprite px={PX} />
        </div>
        {toy && (
          <div key={toy.id} className="toy" data-toy={toy.kind}>
            {toy.kind === "mouse" ? <PixelArt rows={MOUSE} classes={MOUSE_CLASSES} px={3} /> : <PixelArt rows={YARN} classes={YARN_CLASSES} px={3} />}
          </div>
        )}
        <span className="pix bl">{CAT_NAME}</span>
        <span className="pix br">v4.2</span>
        <div className="scanlines" />
      </div>
      <div className="stats">
        {stats.map(([label, key]) => {
          const v = Math.round(pet[key] as number);
          return (
            <div key={key} className="stat">
              <span>{label}</span>
              <span className="bar" data-level={level(v)}><i style={{ width: `${v}%` }} /></span>
              <b>{String(v).padStart(3, "0")}</b>
            </div>
          );
        })}
      </div>
      <div className="pad" role="group" aria-label="Care buttons">
        <button onClick={() => doAct("feed")}>FEED</button>
        <button onClick={() => doAct("play")}>PLAY</button>
        <button onClick={() => doAct("nap")}>{pet.asleep ? "WAKE" : "NAP"}</button>
        <button onClick={() => doAct("clean")}>CLEAN</button>
      </div>
      <div className="feed" aria-live="off">
        {log.map((l, i) => (
          <div key={`${l.t}-${i}-${l.text}`} className="order">
            <span className="id">{l.t}</span>
            <span className="kind" data-tone={l.tone}>{l.text}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
