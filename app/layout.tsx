import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Sal jy my Valentyn wees?",
  description: "’n Oulike Valentyn-brief met speelse interaksies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="af">
      <body className={fredoka.className}>{children}</body>
    </html>
  );
}
