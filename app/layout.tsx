import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Life OS Dashboard",
  description: "Samsung Galaxy 기반 Personal Executive Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
