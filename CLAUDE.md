# Portfolio (HZ·OPS)

Next.js App Router + TypeScript, plain CSS. No Tailwind, no component library, no animation library.

- All copy lives in `src/lib/content.ts`. Edit content there, not in components.
- Styling is global class-based CSS in `src/app/globals.css`, organised by section. Use the semantic tokens; never hard-code hex in components. Themes swap tokens on `<html data-theme>`.
- Motion rules: nothing loops except the live tile, nothing autoplays below the fold, every animation has a reduced-motion fallback (`data-rm` on `.root` and the media query).
- Layout transitions use `useFlip` (WAAPI). Call `flip(selector, update)` around the state change.
- Lint is strict about `setState` inside effects: use `useSyncExternalStore` for external state (see `src/hooks/useMedia.ts`).
- Verify with `npm run lint && npm run build`.
