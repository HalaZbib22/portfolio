"use client";

import type { MouseEvent } from "react";
import { Panel } from "./Panel";
import { CONTACT, PROJECTS, type Project } from "@/lib/content";

type Props = { expanded: string | null; onToggle: (id: string) => void };

const stop = (e: MouseEvent) => e.stopPropagation();

export function Fleet({ expanded, onToggle }: Props) {
  return (
    <Panel id="s3" panel="fleet" index={3} tab="03 · FLEET" right={`${PROJECTS.length} SERVICES · ${PROJECTS.length} UP · 0 DOWN`}>
      <div className="fleet-grid">
        {PROJECTS.map((p) => (
          <ServiceCard key={p.id} p={p} open={expanded === p.id} onToggle={onToggle} />
        ))}
      </div>
    </Panel>
  );
}

function ServiceCard({ p, open, onToggle }: { p: Project; open: boolean; onToggle: (id: string) => void }) {
  const toggle = (e: MouseEvent) => { e.stopPropagation(); onToggle(p.id); };
  return (
    <article className="card" data-expanded={open} tabIndex={0}>
      <div className="card-head">
        <span className="glyph">{p.glyph}</span>
        <button className="card-name" onClick={toggle} aria-expanded={open}>{p.name}</button>
        <span className="tag"><span className="light" data-light={p.light} />{p.status}</span>
      </div>
      <p className="desc">{p.desc}</p>
      <div className="stack">{p.stack}</div>
      <div className="tele-row">
        <div className="tele-inline">
          <span>uptime <b className="ok">{p.uptime}</b></span>
          <span>role <b>{p.role}</b></span>
          <span>{p.size}</span>
        </div>
      </div>
      <div className="actions">
        <button className="btn" onClick={toggle}>{open ? "close · esc" : "service detail"}</button>
        <a className="btn-ghost" href={p.href ?? CONTACT.linkedin} target="_blank" rel="noreferrer" onClick={stop}>
          {p.linkLabel ?? "production · private"}
        </a>
      </div>
      {open && (
        <div className="detail">
          <div className="topo">
            <div className="h">service topology</div>
            <div className="nodes">
              {p.arch.map((n, i) => (
                <span key={n} className="node"><span>{n}</span>{i < p.arch.length - 1 && <i>→</i>}</span>
              ))}
            </div>
            <div className="tele">{p.tele}</div>
          </div>
          <div className="pbr">
            <span className="problem">problem</span><p>{p.problem}</p>
            <span className="built">built</span><p>{p.built}</p>
            <span className="result">result</span><p>{p.result}</p>
          </div>
          {p.embed && (
            <div className="embed">
              <div className="embed-head">
                <span className="l"><span className="tag-l">LIVE · EMBEDDED SERVICE</span><span className="note">{p.embedNote}</span></span>
                <span className="r">
                  <span className="light" data-light="ok" />interactive · pan / zoom / pick
                  <a href={p.href} target="_blank" rel="noreferrer" onClick={stop}>open ↗</a>
                </span>
              </div>
              <div className="embed-frame">
                <iframe src={p.embed} title={p.name} loading="lazy" />
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
