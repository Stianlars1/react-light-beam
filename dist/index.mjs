"use client";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { jsx } from 'react/jsx-runtime';

var useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;
var isConfig = (value) => value && !Array.isArray(value) && typeof value === "object";
var emptyArray = [];
var defaultConfig = {};
var _gsap = gsap;
var useGSAP = (callback, dependencies = emptyArray) => {
  let config = defaultConfig;
  if (isConfig(callback)) {
    config = callback;
    callback = null;
    dependencies = "dependencies" in config ? config.dependencies : emptyArray;
  } else if (isConfig(dependencies)) {
    config = dependencies;
    dependencies = "dependencies" in config ? config.dependencies : emptyArray;
  }
  callback && typeof callback !== "function" && console.warn("First parameter must be a function or config object");
  const { scope, revertOnUpdate } = config, mounted = useRef(false), context = useRef(_gsap.context(() => {
  }, scope)), contextSafe = useRef((func) => context.current.add(null, func)), deferCleanup = dependencies && dependencies.length && !revertOnUpdate;
  deferCleanup && useIsomorphicLayoutEffect(() => {
    mounted.current = true;
    return () => context.current.revert();
  }, emptyArray);
  useIsomorphicLayoutEffect(() => {
    callback && context.current.add(callback, scope);
    if (!deferCleanup || !mounted.current) {
      return () => context.current.revert();
    }
  }, dependencies);
  return { context: context.current, contextSafe: contextSafe.current };
};
useGSAP.register = (core) => {
  _gsap = core;
};
useGSAP.headless = true;
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
gsap.registerPlugin(ScrollTrigger, useGSAP);
var defaultStyles = {
  height: "var(--react-light-beam-height, 500px)",
  width: "var(--react-light-beam-width, 100vw)",
  // CRITICAL: NO transition on GSAP-controlled properties (background, opacity, mask)
  // Transitions would fight with GSAP's instant updates, causing visual glitches
  // especially when scroll direction changes
  transition: "none",
  willChange: "background, opacity",
  // Specific properties for better performance
  userSelect: "none",
  pointerEvents: "none",
  contain: "layout style paint",
  // CSS containment for better performance
  WebkitTransition: "none",
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
  const { isDarkmode } = useIsDarkmode();
  const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;
  const colorRef = useRef(chosenColor);
  const invertRef = useRef(invert);
  const maskByProgressRef = useRef(maskLightByProgress);
  useEffect(() => {
    colorRef.current = chosenColor;
    invertRef.current = invert;
    maskByProgressRef.current = maskLightByProgress;
    if (elementRef.current) {
      elementRef.current.style.setProperty("--beam-color", chosenColor);
    }
  }, [chosenColor, colorLightmode, colorDarkmode, invert, maskLightByProgress]);
  useEffect(() => {
    onLoaded && onLoaded();
  }, []);
  useGSAP(
    () => {
      const element = elementRef.current;
      if (!element || typeof window === "undefined") return;
      const opacityMin = 0.839322;
      const opacityRange = 0.160678;
      const updateGradientVars = (progress) => {
        const leftPos = 90 - progress * 90;
        const rightPos = 10 + progress * 90;
        const leftSize = 150 - progress * 50;
        element.style.setProperty("--beam-left-pos", `${leftPos}%`);
        element.style.setProperty("--beam-right-pos", `${rightPos}%`);
        element.style.setProperty("--beam-left-size", `${leftSize}%`);
      };
      const updateColorVar = (color) => {
        element.style.setProperty("--beam-color", color);
      };
      const updateMaskVars = (progress) => {
        if (maskByProgressRef.current) {
          const stopPoint = 50 + progress * 45;
          element.style.setProperty("--beam-mask-stop", `${stopPoint}%`);
        }
      };
      const initGradientStructure = (color) => {
        updateColorVar(color);
        const baseGradient = `conic-gradient(from 90deg at var(--beam-left-pos) 0%, var(--beam-color), transparent 180deg) 0% 0% / 50% var(--beam-left-size) no-repeat, conic-gradient(from 270deg at var(--beam-right-pos) 0%, transparent 180deg, var(--beam-color)) 100% 0% / 50% 100% no-repeat`;
        element.style.background = baseGradient;
        if (maskByProgressRef.current) {
          element.style.maskImage = `linear-gradient(to bottom, var(--beam-color) 0%, transparent var(--beam-mask-stop))`;
          element.style.webkitMaskImage = `linear-gradient(to bottom, var(--beam-color) 0%, transparent var(--beam-mask-stop))`;
        } else {
          element.style.maskImage = `linear-gradient(to bottom, var(--beam-color) 25%, transparent 95%)`;
          element.style.webkitMaskImage = `linear-gradient(to bottom, var(--beam-color) 25%, transparent 95%)`;
        }
      };
      const adjustedFullWidth = 1 - fullWidth;
      const calculateProgress = (rawProgress) => {
        const normalizedPosition = Math.max(
          adjustedFullWidth,
          // Minimum (floor)
          Math.min(1, 1 - rawProgress)
          // Convert GSAP progress to Framer's normalized position
        );
        return invertRef.current ? normalizedPosition : 1 - normalizedPosition;
      };
      const scroller = scrollElement ? scrollElement : void 0;
      initGradientStructure(colorRef.current);
      const st = ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        // Element top hits viewport bottom
        end: "top top",
        // Element top hits viewport top
        scroller,
        scrub: true,
        // Instant scrubbing
        onUpdate: (self) => {
          const progress = calculateProgress(self.progress);
          updateGradientVars(progress);
          updateMaskVars(progress);
          element.style.opacity = String(opacityMin + opacityRange * progress);
        },
        onRefresh: (self) => {
          const progress = calculateProgress(self.progress);
          updateGradientVars(progress);
          updateMaskVars(progress);
          element.style.opacity = String(opacityMin + opacityRange * progress);
        }
      });
      const initialProgress = calculateProgress(st.progress);
      updateGradientVars(initialProgress);
      updateMaskVars(initialProgress);
      element.style.opacity = String(opacityMin + opacityRange * initialProgress);
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return () => {
        st.kill();
        clearTimeout(refreshTimeout);
      };
    },
    {
      // CRITICAL: Use refs for frequently changing values!
      // colorRef, invertRef, maskByProgressRef allow updates without recreating ScrollTrigger
      // This prevents visual glitches when these values change mid-scroll
      // Only include values that affect ScrollTrigger's position/range calculations
      dependencies: [
        fullWidth,
        // Affects trigger range
        scrollElement
        // Affects which element to watch
      ],
      scope: elementRef
    }
  );
  const combinedClassName = `react-light-beam ${className || ""}`.trim();
  const finalStyles = disableDefaultStyles ? {
    // No default styles, only user styles
    willChange: "background, opacity",
    contain: "layout style paint",
    ...style
    // User styles override
  } : {
    // Merge default styles with user styles
    ...defaultStyles,
    ...style
    // User styles override everything
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: elementRef,
      className: combinedClassName,
      style: finalStyles,
      ...id ? { id } : {}
    }
  );
};
/*! Bundled license information:

@gsap/react/src/index.js:
  (*!
   * @gsap/react 2.1.2
   * https://gsap.com
   *
   * Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  *)
*/

export { LightBeam };
//# sourceMappingURL=index.mjs.map