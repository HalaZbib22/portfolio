/*
 * Mochi as a pixel character, in the style of classic pixel-cat sets: a one-pixel outline, a big head with triangle ears
 * (pink inside), the taupe tabby mask with cream breaks, 2×2 pale blue eyes with an inward pupil, a pink nose over a two-dot
 * mouth, three whiskers a side, an enormous cream ruff, a narrower body with two front legs, dark gloves, a thick tail
 * curling up on the right, and a soft shadow. Her lynx-point colours throughout.
 *
 * HALF is the left 15 columns; the right side is mirrored, then the tail is overlaid and the outline is derived
 * (any empty cell next to a body cell). Edit the art, not the outline.
 * c cream · s cream shade · m mid taupe · d dark taupe · p pink · e eye · k pupil · n nose · o hand outline · w whisker · t tail · x shadow
 */
const HALF = [
  ".......d.......",
  "......dp.......",
  ".....dppp......",
  ".....dpppp.....",
  "...ddddddmmmmmm",
  "...dddmmmmmmmmm",
  "...ddmmmmmcmmmm",
  "...mmmmmmmmmmmm",
  "...mmmmcccceecc",
  "...mmmmccccekcc",
  "ww.cccccccccccc",
  "...cccccccccccn",
  "ww.ccccccccccoc",
  "...cccccccccccc",
  "ww.cccccccccccc",
  "...cccccccccccc",
  ".......cccccccc",
  ".......cccccccc",
  ".......cccccccc",
  ".......sscccccc",
  ".......sss.ssss",
  ".......ddd.ssss",
  ".......ddd.....",
  "...............",
  "....xxxxxxxxxxx",
  "......xxxxxxxxx",
];
const TAIL_CELLS: Record<number, number[]> = {22: [24, 25, 26], 21: [25, 26, 27], 20: [26, 27, 28], 19: [27, 28, 29], 18: [28, 29, 30], 17: [29, 30, 31], 16: [30, 31, 32], 15: [31, 32, 33], 14: [32, 33], 13: [31, 32, 33]};
export const MOCHI_W = 35;
export const MOCHI_H = HALF.length;
const BODY = new Set("csmdpeknt");

function build(): string[] {
  const rows = HALF.map((h) => [...(h + [...h].reverse().join("") + ".....")]);
  for (const [y, xs] of Object.entries(TAIL_CELLS)) for (const x of xs) rows[+y][x] = +y === 13 ? "d" : "t";
  const out = rows.map((r) => [...r]);
  rows.forEach((r, y) =>
    r.forEach((ch, x) => {
      if (ch !== ".") return;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const n = rows[y + dy]?.[x + dx];
        if (n && BODY.has(n)) { out[y][x] = "o"; return; }
      }
    }),
  );
  return out.map((r) => r.join(""));
}
export const MOCHI = build();

type Cell = { x: number; y: number };
const cells = (...chars: string[]): Cell[] =>
  MOCHI.flatMap((row, y) => [...row].map((c, x) => (chars.includes(c) ? { x, y } : null)).filter((c): c is Cell => c !== null));
const LAYERS: [string, Cell[]][] = [
  ["cat-shadow", cells("x")],
  ["cat-fur", cells("c")],
  ["cat-shade", cells("s")],
  ["cat-mid", cells("m")],
  ["cat-dark", cells("d")],
  ["cat-pink", cells("p")],
  ["cat-nose", cells("n")],
  ["cat-line", cells("o", "w")],
];
const EYES = cells("e");
const PUPILS = cells("k");
const TAIL = cells("t");

type Props = { px?: number; eyesRef?: React.Ref<SVGGElement>; className?: string };

/** The sprite alone. Colour, blinking, tail sway and eye tracking are driven by CSS classes on an ancestor `.cat`. */
export function MochiSprite({ px = 3, eyesRef, className }: Props) {
  const w = MOCHI_W * px;
  const h = MOCHI_H * px;
  const rects = (list: Cell[], key: string) =>
    list.map((c) => <rect key={`${key}${c.x}-${c.y}`} x={c.x * px} y={c.y * px} width={px} height={px} />);
  return (
    <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden>
      {LAYERS.slice(0, 1).map(([cls, list]) => <g key={cls} className={cls}>{rects(list, cls)}</g>)}
      <g className="cat-tail" style={{ transformOrigin: `${25 * px}px ${22 * px}px` }}>{rects(TAIL, "t")}</g>
      {LAYERS.slice(1).map(([cls, list]) => <g key={cls} className={cls}>{rects(list, cls)}</g>)}
      <g ref={eyesRef} className="cat-look">
        <g className="cat-eyes" style={{ transformOrigin: `50% ${9 * px}px` }}>{rects(EYES, "e")}<g className="cat-pupil">{rects(PUPILS, "k")}</g></g>
      </g>
    </svg>
  );
}
