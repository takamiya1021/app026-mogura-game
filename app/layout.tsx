import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "モグラ叩き | Whack-a-Mole Playground",
  description:
    "60秒間でモグラを叩きまくるブラウザ向けミニゲーム。Next.js 14 と Tailwind CSS 3 で構築。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased text-emerald-950">{children}</body>
    </html>
  );
}
