import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AppShell from "@/components/navigation/AppShell";

export const unstable_instant = false;

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Carbona | AI Carbon Footprint Platform",
  description: "Small Actions. Big Impact. Track, visualize, and reduce your carbon footprint with intelligent analytics, eco-challenges, and personalized AI coaching.",
  keywords: ["carbon footprint", "sustainability", "climate tech", "AI coach", "CO2 tracking", "eco challenges"],
  authors: [{ name: "Carbona Team" }],
  openGraph: {
    title: "Carbona | AI Carbon Footprint Platform",
    description: "Track, visualize, and reduce your carbon footprint with intelligent analytics, eco-challenges, and personalized AI coaching.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('carbona-dark-mode', 'false');
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-brand-emerald selection:text-white">
        <Suspense fallback={null}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
