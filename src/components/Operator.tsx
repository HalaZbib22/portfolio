"use client";

import { Panel } from "./Panel";
import { useSplitFlap } from "@/hooks/useSplitFlap";
import { BIO, CONTACT, HERO, TITLE_LINE } from "@/lib/content";

export function Operator({ reduced }: { reduced: boolean }) {
  const { chars, done } = useSplitFlap(HERO, reduced);
  return (
    <Panel id="s1" panel="operator" index={0} tab="01 · OPERATOR">
      <h1 className="hero-row" data-done={done} aria-label={HERO}>
        {chars.map((c, i) => (
          <span key={i} className="hero-tile" data-space={c === " "} aria-hidden>
            {c}
          </span>
        ))}
      </h1>
      <div className="title-line">
        {TITLE_LINE.map((t, i) => (
          <span key={t}>{i > 0 && <span className="sep"> · </span>}{t}</span>
        ))}
      </div>
      <p className="bio">{BIO}</p>
      <dl className="kv">
        <div><dt>station</dt><dd>Beirut, Lebanon <span className="dim">· UTC+3</span></dd></div>
        <div><dt>channel</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
        <div><dt>uplink</dt><dd><a href={CONTACT.linkedin} target="_blank" rel="noreferrer">{CONTACT.linkedinLabel}</a></dd></div>
        <div><dt>protocols</dt><dd>arabic <span className="dim">(native)</span> · english · french</dd></div>
        <div><dt>uptime</dt><dd>4+ years in production</dd></div>
        <div><dt>role</dt><dd>frontend lead <span className="dim">→</span> .net backend</dd></div>
        <div><dt>station cat</dt><dd>mochi <span className="dim">· bottom rail · click her</span></dd></div>
      </dl>
    </Panel>
  );
}
