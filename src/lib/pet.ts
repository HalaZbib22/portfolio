/*
 * MOCHI.SYS pet model: a pure state machine plus a tiny localStorage-backed store.
 * Paced for portfolio time, not 1996 pocket time: she needs you a little and punishes you never.
 * Stats are 20–100 (a floor, so she sulks but never dies), hunger takes about a day and a half to bottom out,
 * poop shows up once or twice a day, sickness takes days of neglect and clears on its own, and a "while you were
 * gone" routine tops her up so a returning visitor meets a mildly needy cat, not a disaster.
 */
export type Pet = {
  food: number;
  energy: number;
  fun: number;
  asleep: boolean;
  poop: number; // piles on the floor, 0–3
  poopAt: number; // epoch ms when the next pile is due
  sick: boolean;
  sickAt: number; // epoch ms: when a mess started counting toward sickness, or when she fell sick
  weight: number;
  born: number; // epoch ms, 0 = not yet hatched on this browser
  last: number; // epoch ms of the last tick
  nightKey: string; // local date on which the night routine last ran
  dayKey: string; // local date on which the morning routine last ran
};
export type Mood = "NAPPING" | "SICK" | "HUNGRY" | "SLEEPY" | "BORED" | "MESSY" | "PURRING" | "CONTENT";
export type Need = "hungry" | "bored" | "sleepy" | "poop" | "sick";

export const KEY = "hz-mochi-pet";
export const DEFAULT_PET: Pet = { food: 85, energy: 85, fun: 75, asleep: false, poop: 0, poopAt: 0, sick: false, sickAt: 0, weight: 5, born: 0, last: 0, nightKey: "", dayKey: "" };

const H = 60 * 60 * 1000;
const FLOOR = 20;
const MAX_AWAY_MS = 36 * H; // decay stops accruing after a day and a half away
const CATCH_UP_AFTER_MS = 3 * H; // longer than this and the auto-feeder has been at work
const POOP_EVERY_MS = 14 * H;
const SICK_AFTER_MS = 60 * H; // two or more piles left this long
const RECOVER_AFTER_MS = 24 * H; // she gets better on her own
const NIGHT_FROM = 1, NIGHT_TO = 7; // local hours she sleeps on her own
const clamp = (n: number) => Math.max(FLOOR, Math.min(100, n));

/** Per-minute rates. Awake: full to empty in ~36h (food), ~28h (fun), ~55h (energy). Asleep: energy back in ~5h. */
const RATE = {
  awake: { food: -0.046, energy: -0.03, fun: -0.06 },
  asleep: { food: -0.015, energy: 0.3, fun: -0.02 },
};
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export function tick(p: Pet, now: number): Pet {
  if (!p.born) return { ...p, born: now, last: now, poopAt: now + POOP_EVERY_MS };
  const away = Math.max(0, now - p.last);
  const mins = Math.min(MAX_AWAY_MS, away) / 60_000;
  if (mins <= 0) return p;
  const r = p.asleep ? RATE.asleep : RATE.awake;
  const next: Pet = {
    ...p,
    food: clamp(p.food + r.food * mins),
    energy: clamp(p.energy + r.energy * mins),
    fun: clamp(p.fun + (p.sick ? r.fun * 1.5 : r.fun) * mins),
    last: now,
  };
  if (next.asleep && next.energy >= 100) next.asleep = false; // she wakes up on her own
  // poop: only while awake, at most 3 piles
  if (!next.asleep && next.poopAt && now >= next.poopAt && next.poop < 3) {
    next.poop += 1;
    next.poopAt = now + POOP_EVERY_MS;
  } else if (!next.poopAt) next.poopAt = now + POOP_EVERY_MS;
  // sickness: days of a dirty floor; and it clears on its own after a day
  if (next.sick) {
    if (now - next.sickAt >= RECOVER_AFTER_MS) { next.sick = false; next.sickAt = 0; }
  } else if (next.poop >= 2) {
    if (!next.sickAt) next.sickAt = now;
    else if (now - next.sickAt >= SICK_AFTER_MS) { next.sick = true; next.sickAt = now; }
  } else next.sickAt = 0;
  // while you were gone: the auto-feeder topped her up, she slept, and someone cleaned most of the floor
  if (away >= CATCH_UP_AFTER_MS) {
    next.food = Math.max(next.food, 45);
    next.energy = Math.max(next.energy, 60);
    next.fun = Math.max(next.fun, 42); // she found the yarn on her own
    next.poop = Math.min(next.poop, 1);
  }
  // night routine: lights off on her own in the small hours, up again in the morning
  const d = new Date(now); const hour = d.getHours(); const key = dayKey(d);
  if (hour >= NIGHT_FROM && hour < NIGHT_TO && !next.asleep && next.nightKey !== key) { next.asleep = true; next.nightKey = key; }
  if (hour >= NIGHT_TO && next.asleep && next.dayKey !== key && next.nightKey === key) { next.asleep = false; next.dayKey = key; }
  return next;
}

/** A brand-new cat, for demos and screenshots. */
export function fresh(now: number): Pet {
  return { ...DEFAULT_PET, born: now, last: now, poopAt: now + POOP_EVERY_MS };
}

export function needs(p: Pet): Need[] {
  const n: Need[] = [];
  if (p.sick) n.push("sick");
  if (p.food < 40) n.push("hungry");
  if (p.poop >= 2) n.push("poop");
  if (p.fun < 40) n.push("bored");
  if (!p.asleep && p.energy < 35) n.push("sleepy");
  return n;
}

export function mood(p: Pet): Mood {
  if (p.asleep) return "NAPPING";
  if (p.sick) return "SICK";
  if (p.food < 40) return "HUNGRY";
  if (p.energy < 35) return "SLEEPY";
  if (p.fun < 40) return "BORED";
  if (p.poop >= 2) return "MESSY";
  if ((p.food + p.energy + p.fun) / 3 > 75 && p.poop === 0) return "PURRING";
  return "CONTENT";
}

/** Hearts for the meter screen, 0–4. */
export const hearts = (v: number) => Math.max(0, Math.min(4, Math.round((v - FLOOR) / ((100 - FLOOR) / 4))));

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
  if (p.energy < 30) return { pet: p, say: "too tired.", log: "too tired to play · flopped over", ok: false };
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

/** Mochi's real age from her birthday, in years and months. */
export function age(now: number, birthday: string): string {
  const b = new Date(birthday);
  const d = new Date(now);
  let months = (d.getFullYear() - b.getFullYear()) * 12 + (d.getMonth() - b.getMonth());
  if (d.getDate() < b.getDate()) months -= 1;
  return `${Math.floor(months / 12)}Y ${months % 12}M`;
}
/** How long this browser has been looking after her. */
export function tenure(p: Pet, now: number): string {
  if (!p.born) return "--";
  const h = Math.floor((now - p.born) / 3_600_000);
  return h < 24 ? `${h}H` : `${Math.floor(h / 24)}D`;
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
