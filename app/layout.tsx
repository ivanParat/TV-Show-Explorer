import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/Navigation";
import { SessionProvider } from "next-auth/react";
import FavoriteSyncTracker from "./components/FavoriteSyncTracker";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "TV Show Explorer",
  description: "Discover any TV show you want, see its info - including seasons, episodes and cast",
  keywords: ["TV", "Show", "Television", "Series", "Season", "Episode", "Cast", "Actor", "Character"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased flex flex-col min-h-screen`}
      >
      <SessionProvider>
        <FavoriteSyncTracker/>
        <Navigation/>
        {children}
      </SessionProvider>
      </body>
    </html>
  );
}
