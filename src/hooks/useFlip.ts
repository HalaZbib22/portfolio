"use client";

import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";

type Pending = { sel: string; before: Map<Element, DOMRect> };

/**
 * FLIP: measure → update → invert → play.
 * 320ms standard easing, 30ms stagger, matching the motion spec.
 * Call `flip(selector, update)` where `update` performs the state change.
 */
export function useFlip(rootRef: RefObject<HTMLElement | null>, reduced: boolean) {
  const pending = useRef<Pending | null>(null);

  useLayoutEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(p.sel).forEach((el, i) => {
      const b = p.before.get(el);
      if (!b) return;
      const a = el.getBoundingClientRect();
      const dx = b.left - a.left;
      const dy = b.top - a.top;
      if (!dx && !dy && b.width === a.width && b.height === a.height) return;
      el.style.transformOrigin = "top left";
      el.animate(
        [
          { transform: `translate(${dx}px,${dy}px)`, width: `${b.width}px`, height: `${b.height}px` },
          { transform: "none", width: `${a.width}px`, height: `${a.height}px` },
        ],
        { duration: 320, delay: i * 30, easing: "cubic-bezier(.2,0,0,1)", fill: "backwards" },
      );
    });
  });

  return useCallback(
    (sel: string, update: () => void) => {
      const root = rootRef.current;
      if (!root || reduced) {
        update();
        return;
      }
      pending.current = {
        sel,
        before: new Map(Array.from(root.querySelectorAll(sel)).map((e) => [e, e.getBoundingClientRect()])),
      };
      update();
    },
    [rootRef, reduced],
  );
}
