"use client";

import { NAV, THEMES, type ThemeId } from "@/lib/content";

type Props = {
  active: number;
  theme: ThemeId;
  board: boolean;
  onJump: (i: number) => void;
  onTheme: (id: ThemeId) => void;
  onToggleBoard: () => void;
};

export function TopBar({ active, theme, board, onJump, onTheme, onToggleBoard }: Props) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="light" data-light="ok" />
        <b>HZ·OPS</b>
        <span className="brand-sub">portfolio console v4.2</span>
      </div>
      <nav className="nav" aria-label="Sections">
        {NAV.map((n, i) => (
          <button key={n.id} className="nav-item" data-active={active === i} onClick={() => onJump(i)}>
            <span className="num">{n.num}</span>
            <span className="nav-label">{n.label}</span>
            <span className="nav-bar" />
          </button>
        ))}
      </nav>
      <div className="themes" title="theme · press t">
        {THEMES.map((t) => (
          <button
            key={t.id}
            className="theme-dot"
            data-on={t.id === theme}
            onClick={() => onTheme(t.id)}
            title={t.name}
            aria-label={`theme: ${t.name}`}
            style={{ background: t.dot }}
          />
        ))}
      </div>
      <button className="mode-toggle" data-on={board} onClick={onToggleBoard} title="board mode · press b" aria-pressed={board}>
        <span className="knob" />
        <span>BOARD</span>
      </button>
    </header>
  );
}
