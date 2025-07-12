import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Welcome to Youtube Scholar",
  description:
    "YouTube Scholar transforms educational playlists into structured courses — track your progress, take notes, and compete on a global leaderboard. Whether you're rushing up on old topics or diving into something new, we've got your back.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
