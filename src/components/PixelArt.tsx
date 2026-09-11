/** Tiny pixel sprites for the LCD: rows of characters, each character mapped to a CSS class on its <rect>. */
type Props = { rows: string[]; classes: Record<string, string>; px?: number; className?: string };

export function PixelArt({ rows, classes, px = 2, className }: Props) {
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

/* Monochrome LCD glyphs: # = dark pixel. */
export const INK = { "#": "ink" };

/* 8×8 icon bar, in the order of the original device: feed, light, play, clean · meter, meds, and the attention bell. */
export const ICONS: Record<string, string[]> = {
  feed:  ["........", "..####..", ".######.", "########", ".#....#.", ".######.", "..####..", "........"],
  light: ["...##...", "..####..", ".######.", ".######.", "..####..", "..#..#..", "..####..", "...##..."],
  play:  ["..####..", ".#.##.#.", "#..##..#", "########", "#..##..#", ".#.##.#.", "..####..", "........"],
  clean: [".......#", "......#.", ".....#..", "....#...", ".####...", "####....", "###.....", "##......"],
  meter: ["......##", "......##", "...##.##", "...##.##", "##.##.##", "##.##.##", "##.##.##", "########"],
  meds:  [".....###", "....#..#", "...#...#", "..#...#.", ".#..#.#.", "#...#...", "#....#..", "####...."],
  bell:  ["...##...", "..####..", ".######.", ".######.", ".######.", "########", "...##...", "........"],
};

/* The floor decorations. */
export const POOP = ["...#....", "..##....", ".####...", "..###...", ".#####..", "#######.", "########", "........"];
export const BOWL: string[][] = [
  ["........", ".######.", "########", "########", ".######.", "..####..", "........", "........"], // full
  ["........", "........", "..####..", "########", ".######.", "..####..", "........", "........"], // half
  ["........", "........", "........", "########", ".######.", "..####..", "........", "........"], // empty
];
export const HEART_FULL = [".##.##.", "#######", "#######", ".#####.", "..###..", "...#..."];
export const HEART_EMPTY = [".##.##.", "#.#.#.#", "#.....#", ".#...#.", "..#.#..", "...#..."];
export const ZZZ = ["####", "..#.", ".#..", "####"];
export const SKULL = ["..####..", ".######.", "##.##.##", "########", ".######.", "..#.#...", "..####..", "........"];

/* Toys, in colour: a wind-up mouse (g body · k key · e eye · n nose · t tail) and a yarn ball (y · Y lighter strand · s loose end). */
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
