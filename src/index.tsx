"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { LightBeamProps } from "../types/types";
import { useIsDarkmode } from "./hooks/useDarkmode";

// Default inline styles (can be disabled via prop)
const defaultStyles: React.CSSProperties = {
  height: "500px",
  width: "100vw",
  transition: "all 0.25s ease",
  willChange: "all",
  userSelect: "none",
  pointerEvents: "none",
  WebkitTransition: "all 0.25s ease",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
};

export const LightBeam = ({
  className,
  colorLightmode = "rgba(0,0,0, 0.5)",
  colorDarkmode = "rgba(255, 255, 255, 0.5)",
  maskLightByProgress = false,
  fullWidth = 1.0, // Default to full width
  invert = false,
  id = undefined,
  onLoaded = undefined,
  scrollElement,
  disableDefaultStyles = false,
}: LightBeamProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const inViewProgress = useMotionValue(0);
  const opacity = useMotionValue(0.839322);
  const { isDarkmode } = useIsDarkmode();
  const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;

  useEffect(() => {
    onLoaded && onLoaded();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
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

      const handleScrollThrottled = throttle(handleScroll); // Approx 60fps

      const target = scrollElement || window;

      target.addEventListener("scroll", handleScrollThrottled);
      window.addEventListener("resize", handleScrollThrottled);

      // Initial call to handleScroll to set initial state
      handleScroll();

      return () => {
        target.removeEventListener("scroll", handleScrollThrottled);
        window.removeEventListener("resize", handleScrollThrottled);
      };
    }
  }, [inViewProgress, opacity, scrollElement]);

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

  const combinedClassName = `react-light-beam ${className || ""}`.trim();

  // Merge default styles with motion styles
  const mergedStyles = disableDefaultStyles
    ? {
        background: backgroundPosition,
        opacity: opacity,
        maskImage: maskImage,
        WebkitMaskImage: maskImage,
        willChange: "background, opacity",
      }
    : {
        ...defaultStyles,
        background: backgroundPosition,
        opacity: opacity,
        maskImage: maskImage,
        WebkitMaskImage: maskImage,
        willChange: "background, opacity",
      };

  const motionProps: any = {
    style: mergedStyles,
    ref: elementRef,
    className: combinedClassName,
    ...(id ? { id } : {}),
  };

  return <motion.div {...motionProps} />;
};

const throttle = (func: Function) => {
  let ticking = false;
  return function (this: any, ...args: any[]) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
};
