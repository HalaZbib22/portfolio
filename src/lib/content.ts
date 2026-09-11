export type Light = "ok" | "warn" | "down";
export type ThemeId = "night" | "day" | "warehouse" | "dispatch" | "maintenance" | "cold";

export const HERO = "HALA ZBIB";
export const FLAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/·";

/** The station cat that sits on the status bar. Rename freely. */
export const CAT_NAME = "MOCHI";

export const TITLE_LINE = ["frontend engineer with a design habit", "react / next.js", ".net on the side"];

export const BIO =
  "I build interfaces people stare at all day: operational dashboards, live boards, booking flows. I care as much about how a screen feels as how it works, which is why my side projects come with their own design systems, and why this site has five themes and a cat. By day I lead frontend at Koein and have been reaching into the .NET backend since 2026. Off the clock I ship products end to end: a dog-walking marketplace, a shift rota, a seat picker. Computer engineering degree, bootcamp, four years in production, and a master's in engineering management in progress.";


export const THEMES: { id: ThemeId; name: string; dot: string }[] = [
  { id: "night", name: "night shift", dot: "#B48CFF" },
  { id: "day", name: "day shift", dot: "#FFD166" },
  { id: "warehouse", name: "warehouse", dot: "#5CFF8F" },
  { id: "dispatch", name: "dispatch", dot: "#FFB454" },
  { id: "maintenance", name: "maintenance", dot: "#FF7AB8" },
  { id: "cold", name: "cold storage", dot: "#5CE1E6" },
];

export const NAV: { num: string; label: string; id: string }[] = [
  { num: "01", label: "OPERATOR", id: "s1" },
  { num: "02", label: "SHIFT LOG", id: "s2" },
  { num: "03", label: "FLEET", id: "s3" },
  { num: "04", label: "INVENTORY", id: "s4" },
  { num: "05", label: "CERTIFICATIONS", id: "s5" },
];

export const CONTACT = {
  email: "halazbib22@gmail.com",
  linkedin: "https://linkedin.com/in/halazbib",
  linkedinLabel: "linkedin.com/in/halazbib",
};

export type Experience = { company: string; role: string; dates: string; city: string; highlight: string };
export const EXPERIENCE: Experience[] = [
  {
    company: "Koein",
    role: "Senior Frontend Developer · Backend Developer (.NET)",
    dates: "Oct 2024 – present",
    city: "Achrafieh, LB",
    highlight:
      "Frontend lead for NokNok across three Next.js 14 portals; extended into the ASP.NET Core microservices backend in 2026. Led the frontend team, owned component architecture and review standards, coordinated releases across backend, mobile and ops.",
  },
  {
    company: "Endspace MENA",
    role: "Frontend Developer · Born Creators Group",
    dates: "May 2022 – Oct 2024",
    city: "Dbayeh, LB",
    highlight:
      "Built and maintained web and mobile products in React, React Native, Next.js and MUI against partner backends. Led and mentored a team of interns across client projects.",
  },
];

export type Education = { school: string; degree: string; dates: string; city: string; note: string };
export const EDUCATION: Education[] = [
  {
    school: "Lebanese American University",
    degree: "MS, Industrial Engineering & Engineering Management",
    dates: "Sep 2025 – present",
    city: "online",
    note: "Operations, systems and management engineering on top of four years of running real ones.",
  },
  {
    school: "Lebanese International University",
    degree: "BS, Computer Engineering · GPA 3.6/4.0",
    dates: "Oct 2018 – Aug 2021",
    city: "Beirut, LB",
    note: "Teaching assistant for programming courses.",
  },
  {
    school: "ZAKA AI",
    degree: "Applied AI programme · ML, deep learning, NLP, CV",
    dates: "Jan – Jun 2024",
    city: "Beirut, LB",
    note: "Six-month applied track; feeds the applied-AI interest in the inventory.",
  },
  {
    school: "SE Factory",
    degree: "Cycle #16 · 14-week full-stack intensive",
    dates: "Jan – Apr 2022",
    city: "Beirut, LB",
    note: "Went straight from graduation to a frontend role at Endspace.",
  },
];

export type Project = {
  id: string;
  glyph: string;
  name: string;
  status: string;
  light: Light;
  desc: string;
  stack: string;
  uptime: string;
  role: string;
  size: string;
  href?: string;
  linkLabel?: string;
  embed?: string;
  embedNote?: string;
  /** A second link when the repo is public but the running instance is gated. */
  live?: string;
  liveNote?: string;
  tele: string;
  arch: string[];
  problem: string;
  built: string;
  result: string;
};

export const PROJECTS: Project[] = [
  {
    id: "sl",
    glyph: "SL",
    name: "Sidelick",
    status: "live · personal product",
    light: "ok",
    desc: "A dog walking and sitting marketplace, web/PWA-first for Beirut and built to scale into the Gulf: ID-verified walkers, few-tap booking, live walks with check-in photos, server-side quotes.",
    stack: "next.js 14 · typescript · tailwind · react query · express · zod · postgresql · socket.io · web push · jwt",
    uptime: "99.9%",
    role: "sole author",
    size: "pwa · beirut",
    href: "https://sidelick.app",
    linkLabel: "sidelick.app ↗",
    tele: "booking state machine · auto-expiry · socket.io + web push · admin kyc",
    arch: ["PWA client", "Express + Zod API", "Booking FSM", "PostgreSQL", "Socket.IO / Web Push"],
    problem: "Finding a trustworthy dog walker in Beirut is word of mouth. No verification, no live visibility once the dog leaves, no agreed price up front.",
    built:
      "Owners find ID-verified walkers, book in a few taps, follow the walk live with start / mid / end check-in photos and see a server-side price quote before committing. Walkers cannot transact until an admin verifies their government ID and selfie. Underneath: a booking state machine with automatic expiry, recurring bookings, a per-category notification center on Socket.IO plus Web Push, reviews, and an admin panel. Installable PWA.",
    result: "Live at sidelick.app, owned end to end as a personal product. Stripe is the next milestone.",
  },
  {
    id: "sm",
    glyph: "SM",
    name: "Seat map",
    status: "public demo",
    light: "ok",
    desc: "An interactive SVG venue seat picker: ~1,300 seats in 10 sections, procedurally generated, hand-rolled pan / zoom / pinch, fully keyboard- and screen-reader-accessible.",
    stack: "next.js app router · react · typescript · svg · vitest",
    uptime: "100%",
    role: "sole author",
    size: "1,300 seats",
    href: "https://seat-map-jade.vercel.app/event/seaside-sessions",
    linkLabel: "live demo ↗",
    embed: "https://seat-map-jade.vercel.app/event/seaside-sessions",
    embedNote: "seat-map-jade.vercel.app · seaside sessions · 10 zones",
    tele: "one delegated pointer handler · memoised layers · viewport culling · vitest",
    arch: ["Procedural venue", "SVG layers", "Pointer handler", "Selection state", "Table view / a11y"],
    problem: "Venue seat pickers are usually a canvas nobody can use with a keyboard, that re-renders every seat on every pan, and whose layout drifts from the server truth.",
    built:
      "The venue is generated procedurally so the map, tests and server always agree. Two-tier zoom, hand-rolled pan / zoom / pinch with zoom-toward-pointer, one delegated pointer handler, memoised per-section layers so a pan re-renders nothing, viewport culling. Seats are checkboxes with full labels, arrow keys follow the curve of the rows, a live region announces changes, and a table view completes a purchase without touching the map. Vitest covers geometry and selection.",
    result: "Smooth at 1,300 seats on a phone, and a purchase can be completed entirely from the keyboard. The live map is embedded below — poke it.",
  },
  {
    id: "ss",
    glyph: "SS",
    name: "Support Shifts",
    status: "open source · personal tool",
    light: "ok",
    desc: "Shift registration for a dev team's out-of-hours support rota, with its own design system: a wall-calendar week board, same-role swaps, admin locking, payouts, and calendar subscriptions.",
    stack: "next.js 15 · mui · firebase auth · firestore · oklch tokens",
    uptime: "100%",
    role: "sole author",
    size: "design system",
    href: "https://github.com/HalaZbib22/support-shifts",
    linkLabel: "github ↗",
    live: "https://shift-management-tool-murex.vercel.app",
    liveNote: "koein work email required",
    tele: "seat grammar · firestore transactions · ics feeds · oklch dark mode",
    arch: ["Week board", "Seat grammar", "Firestore txn", "ICS feed", "Admin / payouts"],
    problem: "Out-of-hours support was a spreadsheet: nobody could see who held which seat, swaps were chat messages, and someone always ended up with five weekends.",
    built:
      "A week board that reads like a wall calendar with a strict seat grammar (open-and-yours is the only call to action), a fairness strip per person, a shift drawer with handover notes, same-role swaps applied in one Firestore transaction, Draft → Published → Locked weeks, payouts with CSV export, and a private calendar subscription URL per person. Light and dark palettes defined in the same OKLCH space so every seat label clears 4.5:1 in both.",
    result: "In use by the Koein dev team (the live instance is behind Google sign-in with a work email). The Industry design system (steel-blue wireframe, Barlow Condensed, registration marks) is defined once as CSS custom properties; switching modes is one attribute on <html> with no light flash.",
  },
  {
    id: "rt",
    glyph: "RT",
    name: "NokNok real-time platform",
    status: "production · koein",
    light: "ok",
    desc: "The live side of a grocery and restaurant ordering platform: a SignalR connection manager replacing Firebase polling, the live driver map, and a warehouse TV board whose timers never freeze.",
    stack: "next.js 14 · signalr · firestore · mui · .net",
    uptime: "99.97%",
    role: "frontend lead",
    size: "3 portals",
    tele: "singleton hub · ref-counted · backoff → rest · server-clock offset sync",
    arch: ["Merchant portal", "Connection manager", "SignalR hub", "TV board", "REST fallback"],
    problem: "Merchant portals polled Firebase for order changes and every open tab opened its own connection. On the warehouse TV, timers drifted against the server, the hub died silently overnight, and the browser blocked Web Storage entirely.",
    built:
      "A singleton SignalR connection manager with token refresh, reference-counted pooling, event deduplication and exponential-backoff fallback to REST. For the TV: a self-healing board with server-clock offset sync, kiosk zoom controls, and a storage abstraction with Firestore and in-memory fallback.",
    result: "Orders appear the moment they are placed, one connection per tab, and the board survives network drops and storage-less browsers through a whole shift.",
  },
  {
    id: "sec",
    glyph: "SC",
    name: "Security scanner + engineering standards",
    status: "production · koein",
    light: "ok",
    desc: "After removing a live wallet drainer from production config, a signature scanner that runs on every push, plus the contribution guide and its CI quality gate.",
    stack: "github actions · node",
    uptime: "every push",
    role: "author",
    size: "3 repos",
    tele: "signature scan · changelog gate · pr size/title/branch · prettier",
    arch: ["Push / PR", "Signature scanner", "Quality gate", "Merge"],
    problem: "A blockchain wallet drainer had been committed into production frontend config and shipped. Nothing in the pipeline would have caught it.",
    built:
      "A signature-based scanner that runs on every push and PR, the Engineering Standards & Contribution Guide, and a CI quality gate: changelog entries, PR size/title/branch checks, Prettier as a build prerequisite.",
    result: "Adopted across all three frontend repos; supply-chain and formatting failures now stop at CI.",
  },
  {
    id: "ce",
    glyph: "CE",
    name: "CardElla portal",
    status: "shipped · endspace",
    light: "ok",
    desc: "The card-management portal behind Cardella, a digital business card and QR code platform: build the card, manage it, share it by tap or scan. Responsive, Next.js and MUI.",
    stack: "next.js · mui",
    uptime: "shipped",
    role: "frontend · portal",
    size: "2022 – 2024",
    href: "https://cardella.io",
    linkLabel: "cardella.io ↗",
    tele: "portal only · the marketing site is not mine",
    arch: ["Card editor", "Portal (Next.js)", "Public card / QR"],
    problem: "Paper business cards get lost, go stale, and can't be updated after they're handed out.",
    built: "The responsive portal where users create and manage their digital cards, on Next.js and MUI, against the partner backend.",
    result: "Delivered as a client product at Endspace MENA. The public site at cardella.io is the client's; my work is the portal behind it.",
  },
  {
    id: "bg",
    glyph: "BG",
    name: "Bingo",
    status: "shipped · endspace",
    light: "ok",
    desc: "A React Native app for Australian bin-cleaning operators: service scheduling and job management from the truck.",
    stack: "react native",
    uptime: "shipped",
    role: "mobile",
    size: "australia",
    tele: "react native · scheduling · jobs",
    arch: ["Operator app", "Scheduling", "Job management"],
    problem: "Bin-cleaning operators ran their day from calls and paper: no schedule on the road, no record of jobs done.",
    built: "A React Native application for scheduling services and managing jobs, built against a partner backend.",
    result: "Streamlined service scheduling and job management for operators in Australia.",
  },
  {
    id: "vs",
    glyph: "VS",
    name: "Velvet Services",
    status: "live · endspace",
    light: "ok",
    desc: "Public website plus internal operations software for a commercial cleaning company.",
    stack: "react · next.js",
    uptime: "live",
    role: "frontend",
    size: "web + ops",
    href: "https://www.velvetservices.net",
    linkLabel: "velvetservices.net ↗",
    tele: "public site · internal ops tooling",
    arch: ["Public site", "Ops software", "Partner backend"],
    problem: "A commercial cleaning company running day-to-day operations without software built for it.",
    built: "The public website and the internal operations software, built and extended over time against the partner backend.",
    result: "Improved day-to-day operational efficiency for the business.",
  },
];

/** Each item is "name|service record"; an empty record renders as "core interest". */
export type SkillGroup = { name: string; items: { n: string; m: string }[] };
const raw: [string, ...string[]][] = [
  ["languages", "typescript|4+ yrs · every portal", "javascript|4+ yrs", "c#|2026 · noknok backend", "python|zaka ai · tooling", "sql|sql server · postgres", "html|4+ yrs", "css|4+ yrs · emotion, tailwind, oklch"],
  ["frontend", "react 18|4+ yrs · all portals", "next.js 14 (app router)|3 portals in production", "mui v5|noknok · cardella · support shifts", "kendo ui|orders grid", "redux toolkit|merchant portal", "zustand|picker portal", "swr|orders grid · fallback", "react hook form + zod|campaign wizard", "framer motion|motion work", "emotion|noknok", "tiptap|marketing module", "dnd-kit|collections priority", "i18next (rtl)|arabic portals", "react native|bingo", "tailwind|velvet services · sidelick"],
  ["design", "design systems|support shifts · this site", "figma|handoff · own mockups", "oklch color|support shifts dark mode", "typography|barlow · plex mono · grotesk", "motion design|flip · split-flap · this site", "accessibility|seat map · 4.5:1 everywhere"],
  ["backend", "asp.net core|2026 · microservices", "clean architecture|.net services", "grpc|inter-service", "rabbitmq|events", "hangfire|weekly tier pipeline", "ocelot|api gateway", "rest|4+ yrs", "express.js|sidelick · endspace", "auth0|identity · noknok"],
  ["data", "sql server|noknok", "postgresql|sidelick · endspace", "mysql|endspace", "mongodb|endspace", "redis|cache · locks", "firestore|chat · tv board · support shifts", "firebase rtdb|legacy polling → signalr", "algolia|search"],
  ["real-time & maps", "signalr|orders · tv board", "socket.io|sidelick", "websockets|4+ yrs", "fcm|push", "web push|sidelick", "google maps|live order map", "mapbox gl|driver map"],
  ["devops", "github actions|scanner · quality gate", "vercel|this site · seat map", "docker|basics · picker portal dockerfile", "aws|basics", "sentry|errors"],
  ["practice", "application security|idor · supply-chain · uploads", "performance profiling|tv board", "code review & standards|3 repos", "agile / scrum|4+ yrs"],
  ["interests", "real-time systems|", "operational uis|", "applied ai|zaka ai", "cats|mochi · she is on the bottom rail"],
];
export const GROUPS: SkillGroup[] = raw.map(([name, ...items]) => ({
  name,
  items: items.map((s) => {
    const [n, m] = s.split("|");
    return { n, m: m || "core interest" };
  }),
}));
