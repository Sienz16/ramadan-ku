import type { Metadata } from "next";
import { Amiri, Cinzel, Poppins } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ramadan Ku - Rakan Ibadah Ramadan Anda",
  description: "Waktu solat, doa harian, ayat Al-Quran, dan kiraan detik Ramadan untuk umat Islam Malaysia",
  manifest: "/manifest.json",
  themeColor: "#004D40",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ramadan Ku",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#004D40" />
      </head>
      <body
        className={`${amiri.variable} ${cinzel.variable} ${poppins.variable} antialiased touch-manipulation`}
      >
        {children}
      </body>
    </html>
  );
}
