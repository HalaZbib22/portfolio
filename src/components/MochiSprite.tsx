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
/* Two tail frames (a curl, and a flick to the right); pixel tails are frame-swapped, never rotated. Row 12/15 tips are darker. */
const TAIL_FRAMES: Record<"a" | "b", Record<number, number[]>> = {
  a: { 22: [24, 25, 26, 27], 21: [26, 27, 28, 29], 20: [28, 29, 30], 19: [29, 30, 31], 18: [30, 31, 32], 17: [30, 31, 32], 16: [31, 32, 33], 15: [31, 32, 33], 14: [31, 32, 33], 13: [30, 31, 32], 12: [29, 30, 31] },
  b: { 22: [24, 25, 26, 27], 21: [26, 27, 28, 29], 20: [28, 29, 30, 31], 19: [30, 31, 32], 18: [31, 32, 33], 17: [32, 33, 34], 16: [32, 33, 34], 15: [32, 33, 34] },
};
const TIP_ROW = { a: 12, b: 15 } as const;
export const MOCHI_W = 36;
export const MOCHI_H = HALF.length;
const BODY = new Set("csmdpekn");
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

type Cell = { x: number; y: number };
type Frame = { fill: Cell[]; tip: Cell[]; line: Cell[] };

/** Body rows: left half mirrored, then the outline derived from any empty cell touching a body cell. */
function buildBody(): string[] {
  const rows = HALF.map((h) => [...(h + [...h].reverse().join("") + "......")]);
  const out = rows.map((r) => [...r]);
  rows.forEach((r, y) =>
    r.forEach((ch, x) => {
      if (ch !== ".") return;
      if (N4.some(([dx, dy]) => BODY.has(rows[y + dy]?.[x + dx] ?? "."))) out[y][x] = "o";
    }),
  );
  return out.map((r) => r.join(""));
}
export const MOCHI = buildBody();

/** A tail frame: its cells, its darker tip, and its own outline (empty cells around it that the body doesn't already own). */
function buildTail(frame: "a" | "b"): Frame {
  const cells = Object.entries(TAIL_FRAMES[frame]).flatMap(([y, xs]) => xs.map((x) => ({ x, y: +y })));
  const key = (c: Cell) => `${c.x},${c.y}`;
  const own = new Set(cells.map(key));
  const line = new Map<string, Cell>();
  for (const c of cells)
    for (const [dx, dy] of N4) {
      const n = { x: c.x + dx, y: c.y + dy };
      if (own.has(key(n))) continue;
      if ((MOCHI[n.y]?.[n.x] ?? ".") === ".") line.set(key(n), n);
    }
  return { fill: cells.filter((c) => c.y !== TIP_ROW[frame]), tip: cells.filter((c) => c.y === TIP_ROW[frame]), line: [...line.values()] };
}
const TAILS = { a: buildTail("a"), b: buildTail("b") };

const cellsOf = (...chars: string[]): Cell[] =>
  MOCHI.flatMap((row, y) => [...row].map((c, x) => (chars.includes(c) ? { x, y } : null)).filter((c): c is Cell => c !== null));
const LAYERS: [string, Cell[]][] = [
  ["cat-shadow", cellsOf("x")],
  ["cat-fur", cellsOf("c")],
  ["cat-shade", cellsOf("s")],
  ["cat-mid", cellsOf("m")],
  ["cat-dark", cellsOf("d")],
  ["cat-pink", cellsOf("p")],
  ["cat-nose", cellsOf("n")],
  ["cat-line", cellsOf("o", "w")],
];
const EYES = cellsOf("e");
const PUPILS = cellsOf("k");

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
      {(["a", "b"] as const).map((f) => (
        <g key={f} className="cat-tail" data-frame={f}>
          <g className="cat-line">{rects(TAILS[f].line, `tl${f}`)}</g>
          <g className="cat-tailfur">{rects(TAILS[f].fill, `t${f}`)}</g>
          <g className="cat-dark">{rects(TAILS[f].tip, `tt${f}`)}</g>
        </g>
      ))}
      {LAYERS.slice(1).map(([cls, list]) => <g key={cls} className={cls}>{rects(list, cls)}</g>)}
      <g ref={eyesRef} className="cat-look">
        <g className="cat-eyes" style={{ transformOrigin: `50% ${9 * px}px` }}>{rects(EYES, "e")}<g className="cat-pupil">{rects(PUPILS, "k")}</g></g>
      </g>
    </svg>
  );
}
