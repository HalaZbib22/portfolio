/*
 * MOCHI.SYS pet model: a pure state machine plus a tiny localStorage-backed store.
 * Stats are 0–100. They decay in real time, including while the visitor is away (capped at 12 hours),
 * so a returning visitor finds her hungry, not dead.
 */
export type Pet = {
  food: number;
  energy: number;
  fun: number;
  clean: number;
  asleep: boolean;
  born: number; // epoch ms, 0 = not yet hatched on this browser
  last: number; // epoch ms of the last tick
};
export type Mood = "NAPPING" | "HUNGRY" | "SLEEPY" | "BORED" | "MESSY" | "PURRING" | "CONTENT";
export type Action = "feed" | "play" | "nap" | "clean";
export type Toy = "mouse" | "yarn";

export const KEY = "hz-mochi-pet";
export const DEFAULT_PET: Pet = { food: 80, energy: 80, fun: 70, clean: 90, asleep: false, born: 0, last: 0 };

const MAX_AWAY_MS = 12 * 60 * 60 * 1000;
const clamp = (n: number) => Math.max(0, Math.min(100, n));

/** Per-minute decay (or recovery) rates. */
const RATE = {
  awake: { food: -1.5, energy: -1, fun: -2, clean: -0.8 },
  asleep: { food: -0.7, energy: 5, fun: -0.5, clean: -0.3 },
};

export function tick(p: Pet, now: number): Pet {
  if (!p.born) return { ...p, born: now, last: now };
  const mins = Math.min(MAX_AWAY_MS, Math.max(0, now - p.last)) / 60_000;
  if (mins <= 0) return p;
  const r = p.asleep ? RATE.asleep : RATE.awake;
  const next: Pet = {
    ...p,
    food: clamp(p.food + r.food * mins),
    energy: clamp(p.energy + r.energy * mins),
    fun: clamp(p.fun + r.fun * mins),
    clean: clamp(p.clean + r.clean * mins),
    last: now,
  };
  if (next.asleep && next.energy >= 100) next.asleep = false; // she wakes up on her own
  if (!next.asleep && next.energy <= 0) next.asleep = true; // or passes out on the keyboard
  return next;
}

export function mood(p: Pet): Mood {
  if (p.asleep) return "NAPPING";
  if (p.food < 25) return "HUNGRY";
  if (p.energy < 20) return "SLEEPY";
  if (p.fun < 25) return "BORED";
  if (p.clean < 25) return "MESSY";
  if ((p.food + p.energy + p.fun + p.clean) / 4 > 75) return "PURRING";
  return "CONTENT";
}

export type Outcome = { pet: Pet; say: string; log: string; ok: boolean };

export function act(p: Pet, a: Action, toy: Toy = "mouse"): Outcome {
  switch (a) {
    case "feed":
      if (p.asleep) return { pet: p, say: "zzz", log: "tried to feed her mid-nap · ignored", ok: false };
      if (p.food >= 90) return { pet: p, say: "...", log: "not hungry · judging you", ok: false };
      return { pet: { ...p, food: clamp(p.food + 30), clean: clamp(p.clean - 3) }, say: "nom", log: "fed · tuna, the good tin", ok: true };
    case "play":
      if (p.asleep) return { pet: { ...p, asleep: false, fun: clamp(p.fun + 5) }, say: "mrrp?!", log: "woken up for playtime · mildly offended", ok: true };
      if (p.energy < 15) return { pet: p, say: "zzz", log: "too tired to play · flopped over", ok: false };
      return {
        pet: { ...p, fun: clamp(p.fun + 30), energy: clamp(p.energy - 10), food: clamp(p.food - 5) },
        say: "!",
        log: toy === "mouse" ? "played · wind-up mouse, pounced twice" : "played · yarn ball, unravelled the whole thing",
        ok: true,
      };
    case "nap":
      if (p.asleep) return { pet: { ...p, asleep: false }, say: "mrrp", log: "woke up · stretched, judged the room", ok: true };
      return { pet: { ...p, asleep: true }, say: "zzz", log: "curled up on the warm laptop", ok: true };
    case "clean":
      if (p.clean >= 95) return { pet: p, say: "?", log: "already spotless · she licks a paw anyway", ok: false };
      return { pet: { ...p, clean: 100, fun: clamp(p.fun - 5) }, say: "hmph", log: "brushed · a whole second cat's worth of fur", ok: true };
  }
}

export function zoomies(p: Pet): Pet {
  return { ...p, asleep: false, fun: clamp(p.fun + 20), energy: clamp(p.energy - 15) };
}

export function age(p: Pet, now: number): string {
  if (!p.born) return "--";
  const h = Math.floor((now - p.born) / 3_600_000);
  return `${Math.floor(h / 24)}D ${h % 24}H`;
}

// ── store (client only) ────────────────────────────────────────────────────
const listeners = new Set<() => void>();
let cache: Pet | null = null;

export function readPet(): Pet {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...DEFAULT_PET, ...(JSON.parse(raw) as Partial<Pet>) } : DEFAULT_PET;
  } catch {
    cache = DEFAULT_PET;
  }
  return cache;
}
export function writePet(p: Pet) {
  cache = p;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  listeners.forEach((l) => l());
}
export function updatePet(fn: (p: Pet) => Pet) { writePet(fn(readPet())); }
export function subscribePet(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}
export const serverPet = () => DEFAULT_PET;
