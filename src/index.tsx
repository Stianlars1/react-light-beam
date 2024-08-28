"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { LightBeamProps } from "../types/types";
import { useIsDarkmode } from "./hooks/useDarkmode";

export const LightBeam = ({
  className,
  colorLightmode = "rgba(0,0,0, 0.5)",
  colorDarkmode = "rgba(255, 255, 255, 0.5)",

  fullWidth = 1.0, // Default to full width
}: LightBeamProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLElement>(document.body);
  const inViewProgress = useMotionValue(0);
  const opacity = useMotionValue(0.839322);
  const { isDarkmode } = useIsDarkmode();

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Invert the fullWidth value: 1 becomes 0, and 0 becomes 1
        const adjustedFullWidth = 1 - fullWidth;

        // Calculate progress
        const progress =
          1 - Math.max(adjustedFullWidth, Math.min(1, rect.top / windowHeight));

        console.log("progress: ", progress);

        // Update motion values
        inViewProgress.set(progress);
        opacity.set(0.839322 + (1 - 0.839322) * progress);
      }
    };

    // Attach scroll and resize event listeners
    bodyRef.current.addEventListener("scroll", handleScroll);
    bodyRef.current.addEventListener("resize", handleScroll);

    // Initial call to handleScroll to set initial state
    handleScroll();

    return () => {
      bodyRef.current.removeEventListener("scroll", handleScroll);
      bodyRef.current.removeEventListener("resize", handleScroll);
    };
  }, [inViewProgress, opacity]);

  const backgroundPosition = useTransform(
    inViewProgress,
    [0, 1],
    [
      "conic-gradient(from 90deg at 90% 0%, var(--colorTop), transparent 180deg) 0% 0% / 50% 150% no-repeat, conic-gradient(from 270deg at 10% 0%, transparent 180deg, var(--colorTop)) 100% 0% / 50% 100% no-repeat",
      "conic-gradient(from 90deg at 0% 0%, var(--colorTop), transparent 180deg) 0% 0% / 50% 100% no-repeat, conic-gradient(from 270deg at 100% 0%, transparent 180deg, var(--colorTop)) 100% 0% / 50% 100% no-repeat",
    ]
  );

  return (
    <motion.div
      style={
        {
          "--colorTop": `${isDarkmode ? colorDarkmode : colorLightmode}`,
          background: backgroundPosition,
          opacity: opacity,
          height: "100%",
          transition: "background 0.5s ease, opacity 0.5s ease",
          zIndex: -1,
          maskImage: `linear-gradient(to bottom, background 0%,  transparent 98%)`,
        } as any
      }
      ref={elementRef}
      className={`Conic_conic__HBaxC ${className}`}
    />
  );
};

export default LightBeam;
