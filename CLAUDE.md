# Portfolio (HZ·SYS)

Next.js App Router + TypeScript, plain CSS. No Tailwind, no component library, no animation library.

- All copy lives in `src/lib/content.ts`. Edit content there, not in components.
- Styling is global class-based CSS in `src/app/globals.css`, organised by section. Use the semantic tokens; never hard-code hex in components. Themes swap tokens on `<html data-theme>`.
- Motion rules: nothing loops except the Mochi tile and the rail cat, nothing autoplays below the fold, every animation has a reduced-motion fallback (`data-rm` on `.root` and the media query).
- Layout transitions use `useFlip` (WAAPI). Call `flip(selector, update)` around the state change.
- Lint is strict about `setState` inside effects: use `useSyncExternalStore` for external state (see `src/hooks/useMedia.ts`).
- Verify with `npm run lint && npm run build`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
