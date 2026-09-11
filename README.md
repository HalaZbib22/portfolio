# HZ·OPS — Hala Zbib's portfolio

A personal portfolio built as an operations control room: the top bar is a status strip, section headings are board labels, experience is a shift log, projects are a fleet of deployed services, skills are a systems inventory, education is a certifications register.

Next.js App Router, TypeScript, plain CSS variables. No component library, no animation library: the layout transitions are a hand-rolled FLIP on the Web Animations API.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Keyboard

| key | action |
| --- | --- |
| `1`–`5` | jump to a section |
| `j` / `k` | scroll down / up |
| `t` | cycle theme (night shift → day shift → warehouse → dispatch → maintenance → cold storage) |
| `b` | toggle board mode (kiosk density) |
| `?` | help overlay |
| `esc` | collapse service detail / close help |
| A / B / C | Mochi is a tamagotchi: A selects an icon, B confirms, C cancels (← → ↵ ⌫ once the device is focused). Stats decay in real time and persist per browser |

There is one easter egg. The help overlay hints at it.

## Layout

```
src/app/layout.tsx        fonts (IBM Plex Mono for data, Space Grotesk for prose), metadata, pre-paint theme script
src/app/globals.css       tokens, five themes, every component, board mode, mobile, reduced motion
src/lib/content.ts        all copy: experience, education, projects, skills, nav, themes
src/components/Console    root client component: keyboard map, theme, board mode, expand/collapse, active section
src/components/*          TopBar · StatusBar · Panel · Operator (hero) · LiveTile · ShiftLog · Fleet · Inventory · Certs · HelpOverlay
src/hooks/useFlip         FLIP layout transition (320ms, 30ms stagger)
src/hooks/useSplitFlap    hero split-flap resolve (lands under 1.3s, runs once)
src/hooks/useMedia        reduced-motion and theme stores (useSyncExternalStore)
src/lib/pet.ts            the tamagotchi model: decay, actions, mood, localStorage store
```

## Editing content

Everything visible lives in `src/lib/content.ts`. Add a project to `PROJECTS`; give it an `embed` URL and its expanded service panel hosts the live page in a 16:9 iframe. Skills are `"name|service record"` strings; the record shows on hover.

## Design system

Eleven color tokens (`--bg-0/1/2`, `--line`, `--line-strong`, `--fg-0/1/2`, `--accent`, `--accent-2`, `--ok/--warn/--down`), one type scale, a 4px spacing scale, zero radius, no shadows. Themes only swap token values on `<html data-theme>`. Motion tokens: 120 micro · 200 hover · 320 layout · 400 theme · 1200 hero, easing `cubic-bezier(.2,0,0,1)`. Every animation has a reduced-motion fallback.
