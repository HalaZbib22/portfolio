"use client";

import type { Ref } from "react";
import { NAV } from "@/lib/content";
import { StationCat } from "./StationCat";

export function StatusBar({ active, coordRef, zoomiesKey }: { active: number; coordRef: Ref<HTMLDivElement>; zoomiesKey: number }) {
  const n = NAV[active];
  return (
    <div className="statusbar" role="status">
      <StationCat zoomiesKey={zoomiesKey} />
      <div className="sec">
        <span className="light" data-light="ok" />
        LVL {n.num}
        <span className="sec-label"> · {n.label}</span>
      </div>
      <div className="hints">
        <span><kbd>1–5</kbd> jump</span>
        <span className="hint-secondary"><kbd>j</kbd><kbd>k</kbd> scroll</span>
        <span><kbd>t</kbd> theme</span>
        <span className="hint-secondary"><kbd>b</kbd> board</span>
        <span><kbd>?</kbd> help</span>
      </div>
      <div className="coords" ref={coordRef}>X 0000 · Y 0000</div>
      <div className="copy">© 2026 Hala Zbib</div>
    </div>
  );
}
