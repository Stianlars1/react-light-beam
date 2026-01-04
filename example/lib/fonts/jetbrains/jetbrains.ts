import localFont from "next/font/local";

// Variable font option (if you prefer to use the variable font version)
export const jetbrains = localFont({
  src: [
    {
      path: "./JetBrainsMono.woff2",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-jetbrains",
});
