import type { Metadata, Viewport } from "next";
import { Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Disappointment Capsule",
  description:
    "Seal a disappointment. Reflect at 30 days. Find the silver lining at 90.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Disappointment Capsule",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#16100a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-serif text-ticket-t1">{children}</body>
    </html>
  );
}
