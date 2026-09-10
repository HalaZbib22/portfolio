export type Light = "ok" | "warn" | "down";
export type ThemeId = "night" | "day" | "warehouse" | "dispatch" | "maintenance";

export const HERO = "HALA ZBIB";
export const FLAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/·";

export const THEMES: { id: ThemeId; name: string; dot: string }[] = [
  { id: "night", name: "night shift", dot: "#5CE1E6" },
  { id: "day", name: "day shift", dot: "#FFD166" },
  { id: "warehouse", name: "warehouse", dot: "#5CFF8F" },
  { id: "dispatch", name: "dispatch", dot: "#FFB454" },
  { id: "maintenance", name: "maintenance", dot: "#F06BD8" },
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
    id: "rt",
    glyph: "RT",
    name: "NokNok real-time order platform",
    status: "production",
    light: "ok",
    desc: "Merchant order refresh migrated from Firebase polling to SignalR, plus the live driver map and the full orders grid for grocery and restaurant verticals.",
    stack: "next.js 14 · signalr · firebase · mui · .net",
    uptime: "99.97%",
    role: "lead",
    size: "3 portals",
    tele: "singleton hub · ref-counted · dedup · backoff → rest",
    arch: ["Merchant portal", "Connection manager", "SignalR hub", "Order service", "REST fallback"],
    problem: "Merchant portals polled Firebase for order changes: slow to reflect new orders, expensive at scale, and every open tab opened its own connection.",
    built:
      "A singleton SignalR connection manager with token refresh, reference-counted pooling across components, event deduplication and exponential-backoff fallback to REST. On top of it: the live order map with real-time driver positions and the orders grid for both verticals.",
    result: "Orders appear the moment they are placed, one connection per tab regardless of screen count, and the portal degrades gracefully to REST when the hub is unreachable.",
  },
  {
    id: "tv",
    glyph: "TV",
    name: "Warehouse TV / kiosk board",
    status: "production · sole author",
    light: "ok",
    desc: "High-density kiosk layout with zoom controls and order timers that never freeze, on TV browsers that block Web Storage entirely.",
    stack: "next.js · signalr · firestore",
    uptime: "99.99%",
    role: "sole author",
    size: "24/7 display",
    tele: "server-clock offset sync · self-healing hub · storage abstraction",
    arch: ["TV browser", "Storage adapter", "SignalR board", "Clock offset sync", "Firestore"],
    problem: "A board that runs all day on a warehouse TV: timers drifted against the server, the SignalR connection died silently overnight, and the TV browser blocked Web Storage so the app crashed on load.",
    built:
      "A self-healing SignalR board with server-clock offset sync so timers are computed against server time, zoom controls for the kiosk layout, and a storage abstraction with Firestore and in-memory fallback.",
    result: "The board survives network drops and storage-less browsers; timers stay correct through the whole shift.",
  },
  {
    id: "pk",
    glyph: "PK",
    name: "Picker Portal",
    status: "production · sole author",
    light: "ok",
    desc: "PLU dashboard through eleven design iterations, price comparison, barcode scanning, item imagery, station and group management, with its own Dockerfile and CI.",
    stack: "next.js · mui · docker · github actions",
    uptime: "99.95%",
    role: "sole author",
    size: "~30 PRs",
    tele: "eleven dashboard iterations · barcode · station mgmt",
    arch: ["Scanner", "Picker portal", "PLU API", "Docker image", "GH Actions"],
    problem: "Pickers needed one screen for PLU lookup, pricing and scanning that works at warehouse pace, and the product had no deployment pipeline.",
    built:
      "The full portal — PLU dashboard iterated eleven times with picker feedback, price comparison, barcode scanning, item imagery, station and group management — plus its Dockerfile and CI pipeline.",
    result: "Shipped and operated end to end by one engineer, about thirty PRs from first commit to production.",
  },
  {
    id: "sec",
    glyph: "SC",
    name: "Security scanner + engineering standards",
    status: "production",
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
    id: "mk",
    glyph: "MK",
    name: "Marketing & promotions module",
    status: "production",
    light: "ok",
    desc: "Multi-step campaign wizard, a collections system with four template types and drag-and-drop priority, Excel import/export, promo codes, Wheel of Fortune, analytics.",
    stack: "next.js · dnd-kit · react hook form + zod",
    uptime: "99.96%",
    role: "lead",
    size: "4 templates",
    tele: "wizard · dnd priority · xlsx · promo · analytics",
    arch: ["Campaign wizard", "Zod schema", "Collections", "Promo engine", "Analytics"],
    problem: "Ops ran campaigns by hand through the backend team: no targeting, no scheduling, no way to order what customers saw first.",
    built:
      "A campaign wizard for budget, audience targeting and scheduling; collections with four template types and dnd-kit priority ordering; Excel import/export; promo codes; Wheel of Fortune; campaign analytics.",
    result: "Marketing ships campaigns without engineering involvement, with validation enforced by shared Zod schemas.",
  },
  {
    id: "dr",
    glyph: "DR",
    name: "Driver & fleet suite",
    status: "production",
    light: "ok",
    desc: "Cash deposits with audit logs and role-gated permissions, performance tiers with overrides, payouts, trip history, utilisation, broadcast messaging.",
    stack: "next.js · .net · hangfire",
    uptime: "99.95%",
    role: "full-stack",
    size: "weekly pipeline",
    tele: "hangfire weekly tiers · analytics · audit log",
    arch: ["Ops portal", ".NET fleet API", "Hangfire tiers", "Audit log"],
    problem: "Driver cash, performance tiers and payouts lived in spreadsheets with no audit trail and no permissions.",
    built:
      "Frontend: cash-deposit management with activity logs and role-gated permissions, tiers with overrides and draft/active states, payouts, trip history, utilisation, broadcast messaging. Backend: the weekly Hangfire tier pipeline, analytics and audit logging.",
    result: "One auditable system across ops and drivers, computed weekly without manual steps.",
  },
];

/** Each item is "name|service record"; an empty record renders as "core interest". */
export type SkillGroup = { name: string; items: { n: string; m: string }[] };
const raw: [string, ...string[]][] = [
  ["languages", "typescript|4+ yrs · every portal", "javascript|4+ yrs", "c#|2026 · noknok backend", "python|zaka ai · tooling", "sql|sql server · postgres", "html|4+ yrs", "css|4+ yrs · emotion, tailwind"],
  ["frontend", "react 18|4+ yrs · all portals", "next.js 14 (app router)|3 portals in production", "mui v5|noknok · cardella", "kendo ui|orders grid", "redux toolkit|merchant portal", "zustand|picker portal", "swr|orders grid · fallback", "react hook form + zod|campaign wizard", "framer motion|motion work", "emotion|noknok", "tiptap|marketing module", "dnd-kit|collections priority", "i18next (rtl)|arabic portals", "react native|bingo", "tailwind|velvet services · sidelick"],
  ["backend", "asp.net core|2026 · microservices", "clean architecture|.net services", "grpc|inter-service", "rabbitmq|events", "hangfire|weekly tier pipeline", "ocelot|api gateway", "rest|4+ yrs", "express.js|sidelick · endspace"],
  ["data", "sql server|noknok", "postgresql|sidelick · endspace", "mysql|endspace", "mongodb|endspace", "redis|cache · locks", "firestore|chat · tv board", "firebase rtdb|legacy polling → signalr", "algolia|search"],
  ["real-time & maps", "signalr|orders · tv board", "socket.io|sidelick", "websockets|4+ yrs", "fcm|push", "web push|sidelick", "google maps|live order map", "mapbox gl|driver map"],
  ["cloud & devops", "gcp (gke, storage, secrets)|noknok", "kubernetes|noknok", "docker|picker portal", "aws|endspace", "github actions|scanner · quality gate", "prometheus|metrics", "sentry|errors"],
  ["integrations", "auth0|identity", "areeba|payments", "whish|payments", "bob finance|payments", "paystack|payments", "twilio|sms", "zendesk|support", "segment|analytics", "dynamics 365|erp sync"],
  ["practice", "application security|idor · supply-chain · uploads", "performance profiling|tv board", "code review & standards|3 repos", "agile / scrum|4+ yrs"],
  ["interests", "real-time systems|", "operational uis|", "applied ai|zaka ai"],
];
export const GROUPS: SkillGroup[] = raw.map(([name, ...items]) => ({
  name,
  items: items.map((s) => {
    const [n, m] = s.split("|");
    return { n, m: m || "core interest" };
  }),
}));
