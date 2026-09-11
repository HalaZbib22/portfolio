"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Panel } from "./Panel";
import { MochiSprite } from "./MochiSprite";
import { BOWL, HEART_EMPTY, HEART_FULL, ICONS, INK, MOUSE, MOUSE_CLASSES, PixelArt, POOP, SKULL, YARN, YARN_CLASSES, ZZZ } from "./PixelArt";
import { CAT_NAME, type Light } from "@/lib/content";
import {
  age, canPlay, clean, feed, hearts, light, meds, mood, needs, playResult, readPet, serverPet, subscribePet, tick, updatePet,
  zoomies as doZoomies, type Need, type Outcome,
} from "@/lib/pet";

const PX = 2;
const TICK_MS = 5000;
const ROUNDS = 5;
const ICON_ORDER = ["feed", "light", "play", "clean", "meter", "meds"] as const;
type Icon = (typeof ICON_ORDER)[number];
type Screen = "idle" | "eat" | "game" | "meter" | "clean";
type Side = "L" | "R";
type Game = { round: number; wins: number; face: Side | null; result: "win" | "miss" | null };
type Toy = "mouse" | "yarn";
type LogLine = { t: string; text: string; tone?: "ok" | "warn" | "accent" };

const pad = (n: number) => String(n).padStart(2, "0");
const stamp = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const MOOD_LIGHT: Record<string, Light> = { NAPPING: "ok", PURRING: "ok", CONTENT: "ok", HUNGRY: "down", SICK: "down", SLEEPY: "warn", BORED: "warn", MESSY: "warn" };
const NEED_TEXT: Record<Need, string> = { sick: "she is SICK. meds.", hungry: "she is HUNGRY.", poop: "clean the floor.", bored: "she is BORED.", sleepy: "she needs the light off." };

/**
 * MOCHI.SYS — a tamagotchi, faithful to the 1996 device: a monochrome LCD with an icon bar, three buttons
 * (A selects, B confirms, C cancels), a hearts meter, a left-or-right guessing game, poop, lights-off sleep,
 * and an attention bell. Plus one borrowed Game Boy trick: a typewriter text box for her lines.
 * The model is in lib/pet.ts; this component is the device.
 */
export function MochiTile({ zoomiesKey }: { zoomiesKey: number }) {
  const pet = useSyncExternalStore(subscribePet, readPet, serverPet);
  const deviceRef = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState(-1);
  const [screen, setScreen] = useState<Screen>("idle");
  const [bite, setBite] = useState(0);
  const [meterPage, setMeterPage] = useState(0);
  const [game, setGame] = useState<Game | null>(null);
  const gameRef = useRef<Game | null>(null);
  useEffect(() => { gameRef.current = game; }, [game]);
  const [toy, setToy] = useState<{ kind: Toy; id: number } | null>(null);
  const nextToy = useRef<Toy>("mouse");
  const [text, setText] = useState("");
  const [shown, setShown] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const [clock, setClock] = useState("--:--");
  const [ageText, setAgeText] = useState("--");
  const [seenZoomies, setSeenZoomies] = useState(0);
  const zoomies = zoomiesKey > seenZoomies;
  const timers = useRef<number[]>([]);
  const later = useCallback((ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); }, []);
  useEffect(() => { const t = timers.current; return () => t.forEach(clearTimeout); }, []);

  const pushLog = useCallback((t: string, tone?: LogLine["tone"]) => setLog((l) => [{ t: stamp(), text: t, tone }, ...l].slice(0, 2)), []);
  const say = useCallback((s: string) => { setText(s); setShown(0); }, []);
  const commit = useCallback((out: Outcome, tone?: LogLine["tone"]) => {
    if (out.pet !== readPet()) updatePet(() => tick(out.pet, Date.now()));
    say(out.say);
    pushLog(out.log, tone ?? (out.ok ? "accent" : "warn"));
  }, [say, pushLog]);

  // typewriter: reveal one character at a time, then clear after a pause
  useEffect(() => {
    if (!text) return;
    if (shown < text.length) { const t = window.setTimeout(() => setShown((n) => n + 1), 28); return () => window.clearTimeout(t); }
    const t = window.setTimeout(() => setText(""), 3200);
    return () => window.clearTimeout(t);
  }, [text, shown]);

  // real-time decay, clock, and the first line
  useEffect(() => {
    const first = readPet();
    const away = first.born ? Date.now() - first.last : 0;
    const t0 = window.setTimeout(() => {
      if (!first.born) { say(`${CAT_NAME} hatched. good luck.`); pushLog(`hatched · ${CAT_NAME.toLowerCase()} is now your problem`, "accent"); }
      else if (away > 3_600_000) { say(`you were gone ${Math.round(away / 3_600_000)}h.`); pushLog(`you were gone ${Math.round(away / 3_600_000)}h · she noticed`, "warn"); }
      else pushLog("resumed · she pretends not to care");
    }, 0);
    const run = () => { const now = Date.now(); updatePet((p) => tick(p, now)); setClock(stamp()); setAgeText(age(readPet(), now)); };
    run();
    const iv = window.setInterval(run, TICK_MS);
    return () => { window.clearTimeout(t0); window.clearInterval(iv); };
  }, [say, pushLog]);

  // easter egg
  useEffect(() => {
    if (!zoomies) return;
    updatePet(doZoomies);
    const t0 = window.setTimeout(() => { say("ZOOMIES!!!"); pushLog("ZOOMIES · 3am energy, wall to wall", "warn"); }, 0);
    const t = window.setTimeout(() => { setSeenZoomies(zoomiesKey); pushLog("collapsed on the rug", "ok"); }, 5000);
    return () => { window.clearTimeout(t0); window.clearTimeout(t); };
  }, [zoomies, zoomiesKey, say, pushLog]);

  // ── the six icons ──
  const finishGame = useCallback((g: Game) => {
    commit(playResult(readPet(), g.wins, ROUNDS));
    setGame(null);
    setScreen("idle");
    if (g.wins >= Math.ceil(ROUNDS / 2)) {
      const kind = nextToy.current;
      nextToy.current = kind === "mouse" ? "yarn" : "mouse";
      setToy({ kind, id: Date.now() });
      later(2600, () => setToy(null));
    }
  }, [commit, later]);

  const activate = useCallback((icon: Icon) => {
    const p = readPet();
    switch (icon) {
      case "feed": {
        const out = feed(p);
        if (!out.ok) return commit(out);
        setScreen("eat"); setBite(0); say("nom");
        later(550, () => setBite(1)); later(1100, () => setBite(2));
        later(1700, () => { commit(out); setScreen("idle"); });
        return;
      }
      case "light": return commit(light(p), "ok");
      case "play": {
        const no = canPlay(p);
        if (no) return commit(no);
        setGame({ round: 1, wins: 0, face: null, result: null }); setScreen("game"); say("LEFT or RIGHT? A=L  B=R");
        return;
      }
      case "clean": {
        const out = clean(p);
        if (!out.ok) return commit(out);
        setScreen("clean"); say("sweeping...");
        later(900, () => { commit(out, "ok"); setScreen("idle"); });
        return;
      }
      case "meter": setScreen("meter"); setMeterPage(0); return;
      case "meds": return commit(meds(p), "ok");
    }
  }, [commit, say, later]);

  const guess = useCallback((side: Side) => {
    const g = gameRef.current;
    if (!g || g.face) return;
    const face: Side = Math.random() < 0.5 ? "L" : "R";
    const win = face === side;
    setGame({ ...g, face, result: win ? "win" : "miss", wins: g.wins + (win ? 1 : 0) });
    say(win ? "HIT!" : "miss.");
    later(850, () => {
      const cur = gameRef.current;
      if (!cur) return;
      if (cur.round >= ROUNDS) finishGame(cur);
      else { setGame({ round: cur.round + 1, wins: cur.wins, face: null, result: null }); say(`round ${cur.round + 1}. LEFT or RIGHT?`); }
    });
  }, [say, later, finishGame]);

  // ── A / B / C ──
  const pressA = useCallback(() => {
    if (screen === "game") return guess("L");
    if (screen === "meter") return setMeterPage((p) => (p + 1) % 2);
    if (screen !== "idle") return;
    setSel((s) => (s + 1) % ICON_ORDER.length);
  }, [screen, guess]);
  const pressB = useCallback(() => {
    if (screen === "game") return guess("R");
    if (screen === "meter") return setMeterPage((p) => (p + 1) % 2);
    if (screen !== "idle") return;
    if (sel < 0) return say("A picks an icon. B confirms.");
    activate(ICON_ORDER[sel]);
  }, [screen, sel, guess, say, activate]);
  const pressC = useCallback(() => {
    if (screen === "game") { setGame(null); pushLog("game cancelled · she keeps the point", "warn"); }
    setScreen("idle"); setSel(-1); setText("");
  }, [screen, pushLog]);
  const clickIcon = (i: number) => { if (screen !== "idle") setScreen("idle"); setSel(i); activate(ICON_ORDER[i]); };

  // keyboard, only while the device has focus: ← → select (or guess), Enter = B, Backspace = C
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!deviceRef.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); if (screen === "game") guess("L"); else setSel((s) => (s + ICON_ORDER.length - 1) % ICON_ORDER.length); }
      else if (e.key === "ArrowRight") { e.preventDefault(); if (screen === "game") guess("R"); else pressA(); }
      else if (e.key === "Enter") { e.preventDefault(); pressB(); }
      else if (e.key === "Backspace") { e.preventDefault(); pressC(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, guess, pressA, pressB, pressC]);

  const m = mood(pet);
  const need = needs(pet);
  const petMood = zoomies ? "zoomies" : pet.asleep ? "asleep" : m === "SICK" ? "sick" : "idle";
  const iconButton = (ic: Icon, i: number) => (
    <button key={ic} className="icon" data-on={sel === i} onClick={() => clickIcon(i)} title={ic} aria-label={ic}>
      <PixelArt rows={ICONS[ic]} classes={INK} px={2} />
    </button>
  );

  return (
    <Panel panel="live" index={1} tab="">
      <div className="live-head">
        <span className="tag-l">LIVE · {CAT_NAME}.SYS</span>
        <span className="hub"><span className="light" data-light={zoomies ? "warn" : MOOD_LIGHT[m]} />{zoomies ? "ZOOMIES" : m}</span>
      </div>

      <div ref={deviceRef} className="device" tabIndex={0} aria-label={`${CAT_NAME}, a virtual pet. Mood: ${m}. Click to use the keyboard.`}>
        <div className="lcd" data-screen={screen} data-asleep={pet.asleep} data-mood={petMood}>
          <div className="icons">{ICON_ORDER.slice(0, 3).map((ic, i) => iconButton(ic, i))}</div>

          <div className="stage">
            {screen === "meter" ? (
              <div className="meter">
                {meterPage === 0 ? (
                  <>
                    <Row label="HUNGRY" n={hearts(pet.food)} />
                    <Row label="HAPPY" n={hearts(pet.fun)} />
                    <Row label="ENERGY" n={hearts(pet.energy)} />
                  </>
                ) : (
                  <>
                    <div className="row"><span>AGE</span><b>{ageText}</b></div>
                    <div className="row"><span>WEIGHT</span><b>{pet.weight} LB</b></div>
                    <div className="row"><span>STATUS</span><b>{pet.sick ? "SICK" : pet.poop ? "MESSY" : "OK"}</b></div>
                  </>
                )}
                <div className="row pages">{meterPage + 1}/2 · A NEXT · C BACK</div>
              </div>
            ) : (
              <>
                {Array.from({ length: pet.poop }).map((_, i) => <PixelArt key={i} rows={POOP} classes={INK} px={2} className="poop" />)}
                {screen === "eat" && <PixelArt rows={BOWL[bite]} classes={INK} px={2} className="bowl" />}
                {pet.sick && !pet.asleep && <PixelArt rows={SKULL} classes={INK} px={2} className="skull" />}
                {pet.asleep && <PixelArt rows={ZZZ} classes={INK} px={2} className="zzz" />}
                <div className="cat pet" data-face={game?.face ?? undefined}><MochiSprite px={PX} /></div>
                {toy && (
                  <div key={toy.id} className="toy" data-toy={toy.kind}>
                    {toy.kind === "mouse" ? <PixelArt rows={MOUSE} classes={MOUSE_CLASSES} px={2} /> : <PixelArt rows={YARN} classes={YARN_CLASSES} px={2} />}
                  </div>
                )}
                {game && (
                  <div className="game-hud">R{game.round}/{ROUNDS} · {game.wins} HIT{game.result && <b data-r={game.result}>{game.result === "win" ? " ★" : " ×"}</b>}</div>
                )}
              </>
            )}
            {need.length > 0 && (
              <button className="bell" onClick={() => say(need.map((n) => NEED_TEXT[n]).join(" "))} title="she needs something" aria-label="attention">
                <PixelArt rows={ICONS.bell} classes={INK} px={2} />
              </button>
            )}
            <div className="tw" aria-live="polite">
              {text ? <>{text.slice(0, shown)}<i className="cursor" /></> : <span className="tw-idle">{clock} · AGE {ageText}</span>}
            </div>
          </div>

          <div className="icons">{ICON_ORDER.slice(3).map((ic, i) => iconButton(ic, i + 3))}</div>
          <div className="scanlines" />
        </div>

        <div className="abc" role="group" aria-label="Device buttons">
          <button onClick={pressA}><span />A<small>{screen === "game" ? "left" : screen === "meter" ? "next" : "select"}</small></button>
          <button onClick={pressB}><span />B<small>{screen === "game" ? "right" : screen === "meter" ? "next" : "confirm"}</small></button>
          <button onClick={pressC}><span />C<small>cancel</small></button>
        </div>
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

function Row({ label, n }: { label: string; n: number }) {
  return (
    <div className="row">
      <span>{label}</span>
      <span className="hearts">
        {Array.from({ length: 4 }).map((_, i) => <PixelArt key={i} rows={i < n ? HEART_FULL : HEART_EMPTY} classes={INK} px={2} />)}
      </span>
    </div>
  );
}
