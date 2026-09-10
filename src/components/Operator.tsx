"use client";

import { Panel } from "./Panel";
import { useSplitFlap } from "@/hooks/useSplitFlap";
import { CONTACT, HERO } from "@/lib/content";

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
        senior full-stack engineer <span className="sep">·</span> react / next.js <span className="sep">·</span> .net
      </div>
      <p className="bio">
        I&apos;m a full-stack engineer with four-plus years shipping production web platforms. Right now I lead frontend at Koein on
        NokNok, a multi-tenant grocery and restaurant ordering platform: three Next.js portals used by merchants, warehouse staff,
        pickers, drivers and internal ops. My specialty is real-time systems and data-dense operational UIs, the kind of screens that
        run on a warehouse TV all day and can&apos;t freeze. In 2026 I moved into the .NET microservices backend too (C#, gRPC, RabbitMQ,
        Redis, Hangfire). I tend to get handed whole products and own them from first commit through CI/CD and production support.
      </p>
      <dl className="kv">
        <div><dt>station</dt><dd>Beirut, Lebanon <span className="dim">· UTC+3</span></dd></div>
        <div><dt>channel</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
        <div><dt>uplink</dt><dd><a href={CONTACT.linkedin} target="_blank" rel="noreferrer">{CONTACT.linkedinLabel}</a></dd></div>
        <div><dt>protocols</dt><dd>arabic <span className="dim">(native)</span> · english · french</dd></div>
        <div><dt>uptime</dt><dd>4+ years in production</dd></div>
        <div><dt>role</dt><dd>frontend lead <span className="dim">→</span> .net backend</dd></div>
      </dl>
    </Panel>
  );
}
