"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import type { LightBeamProps } from "./types";
import { useIsDarkmode } from "./hooks/useDarkmode";

export type { LightBeamProps };
export { useIsDarkmode };

const defaultStyles: React.CSSProperties = {
  height: "500px",
  width: "100vw",
  transition: "all 0.25s ease",
  willChange: "background, opacity",
  userSelect: "none",
  pointerEvents: "none",
};

export const LightBeam = ({
  className,
  colorLightmode = "rgba(0,0,0, 0.5)",
  colorDarkmode = "rgba(255, 255, 255, 0.5)",
  maskLightByProgress = false,
  fullWidth = 1.0,
  invert = false,
  id,
  onLoaded,
  scrollElement,
}: LightBeamProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const inViewProgress = useMotionValue(0);
  const opacity = useMotionValue(0.839322);
  const { isDarkmode } = useIsDarkmode();
  const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;

  useEffect(() => {
    onLoaded?.();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const adjustedFullWidth = 1 - fullWidth;

        const progress = invert
          ? 0 +
            Math.max(adjustedFullWidth, Math.min(1, rect.top / windowHeight))
          : 1 -
            Math.max(adjustedFullWidth, Math.min(1, rect.top / windowHeight));

        inViewProgress.set(progress);
        opacity.set(0.839322 + (1 - 0.839322) * progress);
      }
    };

    const handleScrollThrottled = throttle(handleScroll);

    const target = scrollElement || window;

    target.addEventListener("scroll", handleScrollThrottled);
    window.addEventListener("resize", handleScrollThrottled);

    handleScroll();

    return () => {
      target.removeEventListener("scroll", handleScrollThrottled);
      window.removeEventListener("resize", handleScrollThrottled);
    };
  }, [inViewProgress, opacity, scrollElement, fullWidth, invert]);

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
        ...defaultStyles,
        background: backgroundPosition,
        opacity: opacity,
        maskImage: maskImage,
        WebkitMaskImage: maskImage,
      }}
      ref={elementRef}
      id={id}
      className={className}
    />
  );
};

const throttle = (func: () => void) => {
  let ticking = false;
  return function () {
    if (!ticking) {
      requestAnimationFrame(() => {
        func();
        ticking = false;
      });
      ticking = true;
    }
  };
};
