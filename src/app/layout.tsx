import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Press_Start_2P, Space_Grotesk } from "next/font/google";
import "./globals.css";

const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const grot = Space_Grotesk({ variable: "--font-grot", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const arcade = Press_Start_2P({ variable: "--font-arcade", subsets: ["latin"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  title: "Hala Zbib", // the tab; the link preview below keeps the role
  description:
    "Senior full-stack engineer in Beirut. React / Next.js / TypeScript / .NET. Real-time, data-dense UIs with a design habit, and a pixel cat you can feed.",
  openGraph: {
    title: "Hala Zbib — Senior Full-Stack Engineer",
    description: "Real-time UIs with a design habit. React / Next.js / .NET. Beirut, Lebanon. Comes with a tamagotchi.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0B0E13", colorScheme: "dark" };

// Applies the saved theme before first paint so returning visitors never see a flash of the default theme.
const themeScript = `try{var t=localStorage.getItem('hz-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${grot.variable} ${arcade.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
