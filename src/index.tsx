"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { LightBeamProps } from "../types/types";
import styles from "./css/lightBeam.module.css";
import { useIsDarkmode } from "./hooks/useDarkmode";

export const LightBeam = ({
  className,
  colorLightmode = "rgba(0,0,0, 0.5)",
  colorDarkmode = "rgba(255, 255, 255, 0.5)",
  maskLightByProgress = false,
  fullWidth = 1.0, // Default to full width
  invert = false,
  id = undefined,
  onLoaded = undefined,
}: LightBeamProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [bodyElement, setBodyElement] = useState<HTMLElement | null>(null); // State to hold the body element
  const inViewProgress = useMotionValue(0);
  const opacity = useMotionValue(0.839322);
  const { isDarkmode } = useIsDarkmode();
  const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;

  useEffect(() => {
    // Set the body element after the component mounts
    setBodyElement(document.body);
    onLoaded && onLoaded();
  }, []);

  useEffect(() => {
    if (bodyElement) {
      const handleScroll = () => {
        if (elementRef.current) {
          const rect = elementRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Invert the fullWidth value: 1 becomes 0, and 0 becomes 1
          const adjustedFullWidth = 1 - fullWidth;

          // Calculate progress
          const progress = invert
            ? 0 +
              Math.max(adjustedFullWidth, Math.min(1, rect.top / windowHeight))
            : 1 -
              Math.max(adjustedFullWidth, Math.min(1, rect.top / windowHeight));

          // Update motion values
          inViewProgress.set(progress);
          opacity.set(0.839322 + (1 - 0.839322) * progress);
        }
      };

      // Attach scroll and resize event listeners
      bodyElement.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);

      // Initial call to handleScroll to set initial state
      handleScroll();

      return () => {
        bodyElement.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [bodyElement, inViewProgress, opacity]);

  const backgroundPosition = useTransform(
    inViewProgress,
    [0, 1],
    [
      `conic-gradient(from 90deg at 90% 0%, ${chosenColor}, transparent 180deg) 0% 0% / 50% 150% no-repeat, conic-gradient(from 270deg at 10% 0%, transparent 180deg, ${chosenColor}) 100% 0% / 50% 100% no-repeat`,
      `conic-gradient(from 90deg at 0% 0%, ${chosenColor}, transparent 180deg) 0% 0% / 50% 100% no-repeat, conic-gradient(from 270deg at 100% 0%, transparent 180deg, ${chosenColor}) 100% 0% / 50% 100% no-repeat`,
    ]
  );
  const maskImageOpacity = useTransform(
    inViewProgress,
    [0, 1],
    [
      `linear-gradient(to bottom, ${chosenColor} 0%, transparent 50%)`,
      `linear-gradient(to bottom, ${chosenColor} 0%, transparent 95%)`,
    ]
  );

  const maskImage = maskLightByProgress
    ? maskImageOpacity
    : `linear-gradient(to bottom, ${chosenColor} 25%, transparent 95%)`;

  return (
    <motion.div
      style={{
        background: backgroundPosition,
        opacity: opacity,
        maskImage: maskImage,
        WebkitMaskImage: maskImage,
      }}
      ref={elementRef}
      id={id}
      className={`lightBeam ${className} ${styles.react__light__beam}`}
    />
  );
};
