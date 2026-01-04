import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LightBeam - React Scroll Animation Component",
  description: "A high-performance React component that creates beautiful light beam effects using GSAP. Smooth scroll animations powered by ScrollTrigger.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
