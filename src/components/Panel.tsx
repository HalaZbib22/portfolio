import type { CSSProperties, ReactNode, Ref } from "react";

type Props = {
  id?: string;
  panel: string;
  index: number;
  tab: string;
  right?: string;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
};

export function Panel({ id, panel, index, tab, right, children, ref }: Props) {
  return (
    <section ref={ref} id={id} className="panel" data-panel={panel} style={{ "--i": index } as CSSProperties}>
      <div className="tab">{tab}</div>
      {right && <div className="tab-right">{right}</div>}
      {children}
    </section>
  );
}
