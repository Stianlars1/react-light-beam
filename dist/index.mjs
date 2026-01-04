"use client";
import { useMotionValue, useTransform, motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { jsx } from 'react/jsx-runtime';

var useIsDarkmode = () => {
  const [isDarkmode, setIsDarkmodeActive] = useState(false);
  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setIsDarkmodeActive(matchMedia.matches);
    };
    setIsDarkmodeActive(matchMedia.matches);
    matchMedia.addEventListener("change", handleChange);
    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, []);
  return { isDarkmode };
};
var defaultStyles = {
  height: "var(--react-light-beam-height, 500px)",
  width: "var(--react-light-beam-width, 100vw)",
  transition: "var(--react-light-beam-transition, all 0.25s ease)",
  willChange: "background, opacity",
  // Specific properties for better performance
  userSelect: "none",
  pointerEvents: "none",
  contain: "layout style paint",
  // CSS containment for better performance
  WebkitTransition: "var(--react-light-beam-transition, all 0.25s ease)",
  WebkitUserSelect: "none",
  MozUserSelect: "none"
};
var LightBeam = ({
  className,
  style,
  colorLightmode = "rgba(0,0,0, 0.5)",
  colorDarkmode = "rgba(255, 255, 255, 0.5)",
  maskLightByProgress = false,
  fullWidth = 1,
  // Default to full width
  invert = false,
  id = void 0,
  onLoaded = void 0,
  scrollElement,
  disableDefaultStyles = false
}) => {
  const elementRef = useRef(null);
  const inViewProgress = useMotionValue(0);
  const opacity = useMotionValue(0.839322);
  const { isDarkmode } = useIsDarkmode();
  const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;
  useEffect(() => {
    onLoaded && onLoaded();
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cachedWindowHeight = window.innerHeight;
    const adjustedFullWidth = 1 - fullWidth;
    const opacityMin = 0.839322;
    const opacityRange = 1 - opacityMin;
    let lastProgress = -1;
    const handleScroll = () => {
      if (!elementRef.current) return;
      const rect = elementRef.current.getBoundingClientRect();
      const normalizedPosition = Math.max(
        adjustedFullWidth,
        Math.min(1, rect.top / cachedWindowHeight)
      );
      const progress = invert ? normalizedPosition : 1 - normalizedPosition;
      if (Math.abs(progress - lastProgress) > 1e-3) {
        lastProgress = progress;
        inViewProgress.set(progress);
        opacity.set(opacityMin + opacityRange * progress);
      }
    };
    const handleResize = () => {
      cachedWindowHeight = window.innerHeight;
      handleScroll();
    };
    const handleScrollThrottled = throttle(handleScroll);
    const handleResizeThrottled = throttle(handleResize);
    const target = scrollElement || document.body || document.documentElement;
    target.addEventListener("scroll", handleScrollThrottled, { passive: true });
    window.addEventListener("resize", handleResizeThrottled, { passive: true });
    handleScroll();
    return () => {
      target.removeEventListener("scroll", handleScrollThrottled);
      window.removeEventListener("resize", handleResizeThrottled);
    };
  }, [inViewProgress, opacity, scrollElement, fullWidth, invert]);
  const backgroundPosition = useTransform(
    inViewProgress,
    [0, 1],
    [
      `conic-gradient(from 90deg at 90% 0%, ${chosenColor}, transparent 180deg) 0% 0% / 50% 150% no-repeat, conic-gradient(from 270deg at 10% 0%, transparent 180deg, ${chosenColor}) 100% 0% / 50% 100% no-repeat`,
      `conic-gradient(from 90deg at 0% 0%, ${chosenColor}, transparent 180deg) 0% 0% / 50% 100% no-repeat, conic-gradient(from 270deg at 100% 0%, transparent 180deg, ${chosenColor}) 100% 0% / 50% 100% no-repeat`
    ]
  );
  const maskImageOpacity = useTransform(
    inViewProgress,
    [0, 1],
    [
      `linear-gradient(to bottom, ${chosenColor} 0%, transparent 50%)`,
      `linear-gradient(to bottom, ${chosenColor} 0%, transparent 95%)`
    ]
  );
  const maskImage = maskLightByProgress ? maskImageOpacity : `linear-gradient(to bottom, ${chosenColor} 25%, transparent 95%)`;
  const combinedClassName = `react-light-beam ${className || ""}`.trim();
  const finalStyles = disableDefaultStyles ? {
    // No default styles, only motion values and user styles
    background: backgroundPosition,
    opacity,
    maskImage,
    WebkitMaskImage: maskImage,
    willChange: "background, opacity",
    contain: "layout style paint",
    // CSS containment for better performance
    ...style
    // User styles override
  } : {
    // Merge default styles with motion values
    ...defaultStyles,
    background: backgroundPosition,
    // MotionValue (overrides default)
    opacity,
    // MotionValue (overrides default)
    maskImage,
    // MotionValue or string
    WebkitMaskImage: maskImage,
    willChange: "background, opacity",
    ...style
    // User styles override everything
  };
  const motionProps = {
    style: finalStyles,
    ref: elementRef,
    className: combinedClassName,
    ...id ? { id } : {}
  };
  return /* @__PURE__ */ jsx(motion.div, { ...motionProps });
};
var throttle = (func) => {
  let ticking = false;
  return function(...args) {
    if (!ticking) {
      ticking = true;
      func.apply(this, args);
      requestAnimationFrame(() => {
        ticking = false;
      });
    }
  };
};

export { LightBeam };
//# sourceMappingURL=index.mjs.map