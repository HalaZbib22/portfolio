/*
 * Mochi, 28 × 24 pixels, drawn from her photos (a lynx-point Siberian):
 * c cream fur · m taupe mask, ears and stripes · e blue eye · k pupil / mouth · n pink nose · t tail (own group so it can sway).
 * Every row is exactly 28 characters.
 */
export const MOCHI = [
  "....m..................m....",
  "...mmm................mmm...",
  "...mmmm..............mmmm...",
  "..mmmmmm............mmmmmm..",
  "..mmmmmmccccccccccccmmmmmm..",
  "..mmmmccccccccccccccccmmmm..",
  "..mmcccccmcccccccmcccccmm...",
  ".ccccccccmcccccccmcccccccc..",
  ".cccccccccccccccccccccccccc.",
  ".ccccccmmmmccccccmmmmcccccc.",
  ".cccccmmeemmccccmmeemmccccc.",
  ".cccccmmkemmccccmmkemmccccc.",
  ".ccccccmmmmcccnncmmmmcccccc.",
  ".ccccccccccccckcccccccccccc.",
  "..cccccccccccccccccccccccc..",
  "...cccccccccccccccccccccc...",
  "...cccccccccccccccccccccc.tt",
  "..ccccccccccccccccccccccctt.",
  "..ccccccccccccccccccccccctt.",
  "..cccccccccccccccccccccccctt",
  "..ccccccccccccccccccccccccct",
  "..cccccccccccccccccccccccc..",
  "..cccc..ccc......ccc..cccc..",
  "..cccc..ccc......ccc..cccc..",
];
export const MOCHI_W = MOCHI[0].length;
export const MOCHI_H = MOCHI.length;

type Cell = { x: number; y: number };
const cells = (ch: string): Cell[] =>
  MOCHI.flatMap((row, y) => [...row].map((c, x) => (c === ch ? { x, y } : null)).filter((c): c is Cell => c !== null));
const LAYERS: [string, Cell[]][] = [
  ["cat-fur", cells("c")],
  ["cat-mask", cells("m")],
  ["cat-dark", cells("k")],
  ["cat-nose", cells("n")],
];
const EYES = cells("e");
const TAIL = cells("t");

type Props = { px?: number; eyesRef?: React.Ref<SVGGElement>; className?: string };

/** The sprite alone. Colour, blinking, tail sway and eye tracking are all driven by CSS classes on an ancestor `.cat`. */
export function MochiSprite({ px = 2, eyesRef, className }: Props) {
  const w = MOCHI_W * px;
  const h = MOCHI_H * px;
  const rects = (list: Cell[], key: string) =>
    list.map((c) => <rect key={`${key}${c.x}-${c.y}`} x={c.x * px} y={c.y * px} width={px} height={px} />);
  return (
    <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden>
      <g className="cat-tail" style={{ transformOrigin: `${25 * px}px ${17 * px}px` }}>{rects(TAIL, "t")}</g>
      {LAYERS.map(([cls, list]) => (
        <g key={cls} className={cls}>{rects(list, cls)}</g>
      ))}
      <g ref={eyesRef} className="cat-look">
        <g className="cat-eyes" style={{ transformOrigin: `50% ${11 * px}px` }}>{rects(EYES, "e")}</g>
      </g>
    </svg>
  );
}
