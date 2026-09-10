import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const grot = Space_Grotesk({ variable: "--font-grot", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Hala Zbib — Senior Full-Stack Engineer",
  description:
    "Senior full-stack engineer in Beirut. React / Next.js / TypeScript / .NET. Real-time systems and data-dense operational UIs: the screens that run a delivery operation.",
  openGraph: {
    title: "Hala Zbib — Senior Full-Stack Engineer",
    description: "Real-time systems and operational UIs. React / Next.js / .NET. Beirut, Lebanon.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0B0E13", colorScheme: "dark" };

// Applies the saved theme before first paint so returning visitors never see a flash of "night shift".
const themeScript = `try{var t=localStorage.getItem('hz-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${grot.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
