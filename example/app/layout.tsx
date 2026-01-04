import type {Metadata} from "next";
import "./globals.css";
import {geistMono, geistSans, inter, jetbrains} from "@/lib/fonts";

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
        <body className={`antialiased ${inter.variable, geistMono.variable, geistSans.variable, jetbrains.variable}`}>
        {children}
        </body>
        </html>
    );
}
