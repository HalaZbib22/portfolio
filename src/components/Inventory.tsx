import { Panel } from "./Panel";
import { GROUPS } from "@/lib/content";

export function Inventory() {
  return (
    <Panel id="s4" panel="inventory" index={4} tab="04 · INVENTORY" right="SYSTEMS · HOVER FOR SERVICE RECORD">
      <div className="groups">
        {GROUPS.map((g) => (
          <div key={g.name}>
            <div className="group-h">
              <span>{g.name}</span><span className="rule" /><span className="n">{String(g.items.length).padStart(2, "0")}</span>
            </div>
            <div className="items">
              {g.items.map((s, i) => (
                <span key={s.n} className="skill" tabIndex={0}>
                  {s.n}
                  {i < g.items.length - 1 && <span className="sep">·</span>}
                  <span className="tele-pop" role="tooltip">{s.m}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
