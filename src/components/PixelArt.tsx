/** Tiny pixel sprites for the LCD: rows of characters, each character mapped to a CSS class on its <rect>. */
type Props = { rows: string[]; classes: Record<string, string>; px?: number; className?: string };

export function PixelArt({ rows, classes, px = 3, className }: Props) {
  const w = rows[0].length * px;
  const h = rows.length * px;
  return (
    <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden>
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          classes[ch] ? <rect key={`${x}-${y}`} className={classes[ch]} x={x * px} y={y * px} width={px} height={px} /> : null,
        ),
      )}
    </svg>
  );
}

/* A wind-up mouse, facing left: g body · k the key on top · e eye · n nose · t tail. */
export const MOUSE = [
  "......kkk...",
  ".......k....",
  "...gg..k....",
  "..gggggggg..",
  ".eggggggggg.",
  "nggggggggggt",
  ".gggggggggt.",
  "..gg..gg.tt.",
];
export const MOUSE_CLASSES = { g: "toy-body", k: "toy-key", e: "toy-eye", n: "toy-nose", t: "toy-tail" };

/* A ball of yarn: y yarn · Y a lighter strand · s the loose end. */
export const YARN = [
  "..yyyy..",
  ".yyYyyy.",
  "yyyyYyyy",
  "yYyyyyYy",
  "yyyyYyyy",
  "yyYyyyyy",
  ".yyyyYy.",
  "..yyyy.s",
];
export const YARN_CLASSES = { y: "toy-yarn", Y: "toy-yarn-hi", s: "toy-yarn-hi" };
