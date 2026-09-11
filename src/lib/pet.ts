/*
 * MOCHI.SYS pet model: a pure state machine plus a tiny localStorage-backed store.
 * Stats are 0–100 and decay in real time, including while the visitor is away (capped at 12 hours),
 * so a returning visitor finds her hungry, not dead. Poop appears on its own; leave it and she gets sick.
 */
export type Pet = {
  food: number;
  energy: number;
  fun: number;
  asleep: boolean;
  poop: number; // piles on the floor, 0–3
  poopAt: number; // epoch ms when the next pile is due
  sick: boolean;
  sickAt: number; // epoch ms when a mess started counting toward sickness (0 = not counting)
  weight: number;
  born: number; // epoch ms, 0 = not yet hatched on this browser
  last: number; // epoch ms of the last tick
};
export type Mood = "NAPPING" | "SICK" | "HUNGRY" | "SLEEPY" | "BORED" | "MESSY" | "PURRING" | "CONTENT";
export type Need = "hungry" | "bored" | "sleepy" | "poop" | "sick";

export const KEY = "hz-mochi-pet";
export const DEFAULT_PET: Pet = { food: 80, energy: 80, fun: 70, asleep: false, poop: 0, poopAt: 0, sick: false, sickAt: 0, weight: 5, born: 0, last: 0 };

const MAX_AWAY_MS = 12 * 60 * 60 * 1000;
const POOP_EVERY_MS = 28 * 60 * 1000;
const SICK_AFTER_MS = 25 * 60 * 1000;
const clamp = (n: number) => Math.max(0, Math.min(100, n));

/** Per-minute decay (or recovery) rates. */
const RATE = {
  awake: { food: -1.5, energy: -1, fun: -2 },
  asleep: { food: -0.7, energy: 5, fun: -0.5 },
};

export function tick(p: Pet, now: number): Pet {
  if (!p.born) return { ...p, born: now, last: now, poopAt: now + POOP_EVERY_MS };
  const ms = Math.min(MAX_AWAY_MS, Math.max(0, now - p.last));
  const mins = ms / 60_000;
  if (mins <= 0) return p;
  const r = p.asleep ? RATE.asleep : RATE.awake;
  const funRate = p.sick ? r.fun * 2 : r.fun;
  const next: Pet = {
    ...p,
    food: clamp(p.food + r.food * mins),
    energy: clamp(p.energy + r.energy * mins),
    fun: clamp(p.fun + funRate * mins),
    last: now,
  };
  if (next.asleep && next.energy >= 100) next.asleep = false; // she wakes up on her own
  if (!next.asleep && next.energy <= 0) next.asleep = true; // or passes out on the keyboard
  // poop: only while awake, at most 3 piles; one pile per interval, even after a long absence
  if (!next.asleep && next.poopAt && now >= next.poopAt && next.poop < 3) {
    next.poop += 1;
    next.poopAt = now + POOP_EVERY_MS;
  } else if (!next.poopAt) next.poopAt = now + POOP_EVERY_MS;
  // sickness: two or more piles left for a while
  if (next.poop >= 2 && !next.sick) {
    if (!next.sickAt) next.sickAt = now;
    else if (now - next.sickAt >= SICK_AFTER_MS) next.sick = true;
  } else if (next.poop < 2) next.sickAt = 0;
  return next;
}

export function needs(p: Pet): Need[] {
  const n: Need[] = [];
  if (p.sick) n.push("sick");
  if (p.food < 25) n.push("hungry");
  if (p.poop >= 2) n.push("poop");
  if (p.fun < 25) n.push("bored");
  if (!p.asleep && p.energy < 20) n.push("sleepy");
  return n;
}

export function mood(p: Pet): Mood {
  if (p.asleep) return "NAPPING";
  if (p.sick) return "SICK";
  if (p.food < 25) return "HUNGRY";
  if (p.energy < 20) return "SLEEPY";
  if (p.fun < 25) return "BORED";
  if (p.poop >= 2) return "MESSY";
  if ((p.food + p.energy + p.fun) / 3 > 75 && p.poop === 0) return "PURRING";
  return "CONTENT";
}

/** Hearts for the meter screen, 0–4. */
export const hearts = (v: number) => Math.round(clamp(v) / 25);

export type Outcome = { pet: Pet; say: string; log: string; ok: boolean };

export function feed(p: Pet): Outcome {
  if (p.asleep) return { pet: p, say: "zzz", log: "tried to feed her mid-nap · ignored", ok: false };
  if (p.food >= 90) return { pet: p, say: "not hungry. judging you.", log: "refused food · judged you", ok: false };
  return { pet: { ...p, food: clamp(p.food + 30), weight: p.weight + 1 }, say: "nom nom nom", log: "fed · tuna, the good tin", ok: true };
}
export function light(p: Pet): Outcome {
  if (p.asleep) return { pet: { ...p, asleep: false }, say: "mrrp. rude.", log: "lights on · woke up, judged the room", ok: true };
  return { pet: { ...p, asleep: true }, say: "zzz", log: "lights off · curled up on the warm laptop", ok: true };
}
export function playResult(p: Pet, wins: number, rounds: number): Outcome {
  const good = wins >= Math.ceil(rounds / 2);
  const pet = { ...p, fun: clamp(p.fun + (good ? 30 : 12)), energy: clamp(p.energy - 10), food: clamp(p.food - 5), weight: Math.max(1, p.weight - 1) };
  return { pet, say: good ? "again! again!" : "you lost. to a cat.", log: `played · guessed ${wins}/${rounds}${good ? " · she is thrilled" : " · she is unimpressed"}`, ok: true };
}
export function canPlay(p: Pet): Outcome | null {
  if (p.asleep) return { pet: p, say: "zzz", log: "she is asleep · try the light", ok: false };
  if (p.energy < 15) return { pet: p, say: "too tired.", log: "too tired to play · flopped over", ok: false };
  return null;
}
export function clean(p: Pet): Outcome {
  if (p.poop === 0) return { pet: p, say: "spotless. as always.", log: "nothing to clean · she licks a paw anyway", ok: false };
  return { pet: { ...p, poop: 0, sickAt: 0 }, say: "finally.", log: `cleaned · ${p.poop} pile${p.poop > 1 ? "s" : ""}, no comment`, ok: true };
}
export function meds(p: Pet): Outcome {
  if (!p.sick) return { pet: p, say: "i'm fine. put it away.", log: "not sick · she refused the pill anyway", ok: false };
  return { pet: { ...p, sick: false, sickAt: 0, fun: clamp(p.fun - 5) }, say: "...hmph. better.", log: "medicine · cured, and furious about it", ok: true };
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
