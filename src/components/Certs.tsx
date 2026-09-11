import { Panel } from "./Panel";
import { EDUCATION } from "@/lib/content";

export function Certs() {
  return (
    <Panel id="s5" panel="certs" index={5} tab="05 · ACHIEVEMENTS" right="EDUCATION · UNLOCKED">
      <div className="rows">
        {EDUCATION.map((e) => (
          <div key={e.school} className="row" tabIndex={0}>
            <div className="cert-grid">
              <div className="l"><span className="school">{e.school}</span><span className="degree">{e.degree}</span></div>
              <div className="r"><span className="dates">{e.dates}</span><span className="city">{e.city}</span></div>
            </div>
            <div className="tele-row"><div className="tele-text"><span className="k">▸ NOTE</span>{e.note}</div></div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
