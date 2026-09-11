"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";
import { Operator } from "./Operator";
import { MochiTile } from "./MochiTile";
import { ShiftLog } from "./ShiftLog";
import { Fleet } from "./Fleet";
import { Inventory } from "./Inventory";
import { Certs } from "./Certs";
import { HelpOverlay } from "./HelpOverlay";
import { useFlip } from "@/hooks/useFlip";
import { useReducedMotion, useTheme } from "@/hooks/useMedia";
import { CONTACT, NAV, THEMES } from "@/lib/content";

export default function Console() {
  const rootRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useTheme();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<"page" | "board">("page");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [active, setActive] = useState(0);
  const [zoomiesKey, setZoomiesKey] = useState(0);
  const typed = useRef("");
  const flip = useFlip(rootRef, reduced);

  const cycleTheme = useCallback(() => {
    const i = THEMES.findIndex((t) => t.id === theme);
    setTheme(THEMES[(i + 1) % THEMES.length].id);
  }, [theme, setTheme]);

  const toggleMode = useCallback(
    () => flip("[data-panel],[data-card]", () => setMode((m) => (m === "board" ? "page" : "board"))),
    [flip],
  );
  const toggleProject = useCallback(
    (id: string) => flip(".card,[data-panel]", () => setExpanded((e) => (e === id ? null : id))),
    [flip],
  );

  const jump = useCallback(
    (i: number) => {
      const el = document.getElementById(NAV[i].id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
      setActive(i);
    },
    [reduced],
  );

  // keyboard map
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      if (e.defaultPrevented || /INPUT|TEXTAREA|SELECT/.test(tag) || e.metaKey || e.ctrlKey || e.altKey) return; // the Mochi device claims its keys first
      const k = e.key;
      if (k >= "1" && k <= "5") { jump(+k - 1); return; }
      if (k === "j") window.scrollBy({ top: 120, behavior: "smooth" });
      else if (k === "k") window.scrollBy({ top: -120, behavior: "smooth" });
      else if (k === "t") cycleTheme();
      else if (k === "b") toggleMode();
      else if (k === "?") setHelp((h) => !h);
      else if (k === "Escape") {
        if (help) setHelp(false);
        else if (expanded) toggleProject(expanded);
      }
      if (/^[a-z]$/.test(k)) {
        typed.current = (typed.current + k).slice(-5);
        if (typed.current === "mochi") { typed.current = ""; setZoomiesKey((n) => n + 1); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump, cycleTheme, toggleMode, toggleProject, help, expanded]);

  // click outside the expanded card collapses it
  useEffect(() => {
    if (!expanded) return;
    const onClick = (e: MouseEvent) => {
      const root = rootRef.current;
      const t = e.target as HTMLElement | null;
      if (root && t && root.contains(t) && !t.closest('.card[data-expanded="true"]')) toggleProject(expanded);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [expanded, toggleProject]);

  // active section tracks scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const i = NAV.findIndex((n) => n.id === en.target.id);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  // dispatch coordinates: direct DOM write, no re-render
  const onMove = (e: PointerEvent) => {
    const el = coordRef.current;
    const root = rootRef.current;
    if (!el || !root) return;
    const r = root.getBoundingClientRect();
    el.textContent = `X ${String(Math.round(e.clientX - r.left)).padStart(4, "0")} · Y ${String(Math.round(e.clientY - r.top)).padStart(4, "0")}`;
  };

  return (
    <div ref={rootRef} className="root" data-mode={mode} data-rm={reduced} onPointerMove={onMove}>
      <TopBar active={active} theme={theme} board={mode === "board"} onJump={jump} onTheme={setTheme} onToggleBoard={toggleMode} />
      <main className="container">
        <Operator reduced={reduced} />
        <MochiTile zoomiesKey={zoomiesKey} />
        <ShiftLog />
        <Fleet expanded={expanded} onToggle={toggleProject} />
        <Inventory />
        <Certs />
        <footer className="footer">
          <span><span className="hi">GAME SAVED</span> · continue: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></span>
          <span>built in next.js · hand-rolled flip · no component library · <span className="k">press ? for help</span></span>
        </footer>
      </main>
      <StatusBar active={active} coordRef={coordRef} zoomiesKey={zoomiesKey} />
      {help && <HelpOverlay onClose={() => setHelp(false)} />}
    </div>
  );
}
