"use client";
'use strict';

var gsap4 = require('gsap');
var ScrollTrigger = require('gsap/ScrollTrigger');
var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var gsap4__default = /*#__PURE__*/_interopDefault(gsap4);

var useIsomorphicLayoutEffect = typeof document !== "undefined" ? react.useLayoutEffect : react.useEffect;
var isConfig = (value) => value && !Array.isArray(value) && typeof value === "object";
var emptyArray = [];
var defaultConfig = {};
var _gsap = gsap4__default.default;
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
  const { scope, revertOnUpdate } = config, mounted = react.useRef(false), context = react.useRef(_gsap.context(() => {
  }, scope)), contextSafe = react.useRef((func) => context.current.add(null, func)), deferCleanup = dependencies && dependencies.length && !revertOnUpdate;
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
  const [isDarkmode, setIsDarkmodeActive] = react.useState(false);
  react.useEffect(() => {
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
var DustParticles = ({ config, beamColor }) => {
  const {
    enabled = false,
    count = 30,
    speed = 1,
    sizeRange = [1, 3],
    opacityRange = [0.2, 0.6],
    color
  } = config;
  const particles = react.useMemo(() => {
    if (!enabled) return [];
    return Array.from({ length: count }, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      const opacity = opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]);
      const duration = (3 + Math.random() * 4) / speed;
      const delay = Math.random() * duration;
      return {
        id: `dust-${i}`,
        x,
        y,
        size,
        opacity,
        duration,
        delay
      };
    });
  }, [enabled, count, sizeRange, opacityRange, speed]);
  useGSAP(
    () => {
      if (!enabled || particles.length === 0) return;
      const timelines = [];
      particles.forEach((particle) => {
        const element = document.getElementById(particle.id);
        if (!element) return;
        const tl = gsap4__default.default.timeline({
          repeat: -1,
          yoyo: true,
          delay: particle.delay
        });
        tl.to(element, {
          y: `-=${20 + Math.random() * 30}`,
          // Float upward 20-50px
          x: `+=${Math.random() * 20 - 10}`,
          // Slight horizontal drift ±10px
          opacity: particle.opacity * 0.5,
          // Fade slightly
          duration: particle.duration,
          ease: "sine.inOut"
        });
        timelines.push(tl);
      });
      return () => {
        timelines.forEach((tl) => tl.kill());
      };
    },
    {
      dependencies: [particles, enabled]
    }
  );
  if (!enabled) return null;
  const particleColor = color || beamColor;
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: particles.map((particle) => /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      id: particle.id,
      style: {
        position: "absolute",
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        borderRadius: "50%",
        backgroundColor: particleColor,
        opacity: particle.opacity,
        pointerEvents: "none",
        willChange: "transform, opacity"
      }
    },
    particle.id
  )) });
};
var MistEffect = ({ config, beamColor }) => {
  const {
    enabled = false,
    intensity = 0.3,
    speed = 1,
    layers = 2
  } = config;
  const mistLayers = react.useMemo(() => {
    if (!enabled) return [];
    return Array.from({ length: layers }, (_, i) => {
      const layerOpacity = intensity * 0.6 / (i + 1);
      const duration = (8 + i * 3) / speed;
      const delay = i * 1.5 / speed;
      const scale = 1 + i * 0.2;
      return {
        id: `mist-layer-${i}`,
        opacity: layerOpacity,
        duration,
        delay,
        scale
      };
    });
  }, [enabled, intensity, speed, layers]);
  useGSAP(
    () => {
      if (!enabled || mistLayers.length === 0) return;
      const timelines = [];
      mistLayers.forEach((layer) => {
        const element = document.getElementById(layer.id);
        if (!element) return;
        const tl = gsap4__default.default.timeline({
          repeat: -1,
          yoyo: false
        });
        tl.fromTo(
          element,
          {
            x: "-100%",
            opacity: 0
          },
          {
            x: "100%",
            opacity: layer.opacity,
            duration: layer.duration,
            ease: "none",
            delay: layer.delay
          }
        ).to(element, {
          opacity: 0,
          duration: layer.duration * 0.2,
          ease: "power1.in"
        });
        timelines.push(tl);
      });
      return () => {
        timelines.forEach((tl) => tl.kill());
      };
    },
    {
      dependencies: [mistLayers, enabled]
    }
  );
  if (!enabled) return null;
  const mistColor = beamColor.replace(/[\d.]+\)$/g, `${intensity})`);
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: mistLayers.map((layer) => /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      id: layer.id,
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `radial-gradient(ellipse 120% 80% at 50% 20%, ${mistColor}, transparent 70%)`,
        opacity: 0,
        pointerEvents: "none",
        willChange: "transform, opacity",
        transform: `scale(${layer.scale})`,
        filter: "blur(40px)"
      }
    },
    layer.id
  )) });
};
var PulseEffect = ({ config, containerRef }) => {
  const {
    enabled = false,
    duration = 2,
    intensity = 0.2,
    easing = "sine.inOut"
  } = config;
  useGSAP(
    () => {
      if (!enabled || !containerRef.current) return;
      const element = containerRef.current;
      const timeline = gsap4__default.default.timeline({
        repeat: -1,
        // Infinite loop
        yoyo: true
        // Reverse on each iteration
      });
      const maxMultiplier = Math.min(2, 1 + intensity);
      timeline.fromTo(
        element,
        {
          "--pulse-multiplier": 1
        },
        {
          "--pulse-multiplier": maxMultiplier,
          duration,
          ease: easing
        }
      );
      const updateOpacity = () => {
        const baseOpacity = getComputedStyle(element).getPropertyValue("--base-opacity") || "1";
        const pulseMultiplier = getComputedStyle(element).getPropertyValue("--pulse-multiplier") || "1";
        element.style.opacity = `calc(${baseOpacity} * ${pulseMultiplier})`;
      };
      const ticker = gsap4__default.default.ticker.add(updateOpacity);
      return () => {
        timeline.kill();
        gsap4__default.default.ticker.remove(ticker);
      };
    },
    {
      dependencies: [enabled, duration, intensity, easing],
      scope: containerRef
    }
  );
  return null;
};
gsap4__default.default.registerPlugin(ScrollTrigger.ScrollTrigger, useGSAP);
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
  disableDefaultStyles = false,
  dustParticles = { enabled: false },
  mist = { enabled: false },
  pulse = { enabled: false }
}) => {
  const elementRef = react.useRef(null);
  const { isDarkmode } = useIsDarkmode();
  const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;
  const colorRef = react.useRef(chosenColor);
  const invertRef = react.useRef(invert);
  const maskByProgressRef = react.useRef(maskLightByProgress);
  react.useEffect(() => {
    colorRef.current = chosenColor;
    invertRef.current = invert;
    maskByProgressRef.current = maskLightByProgress;
    if (elementRef.current) {
      elementRef.current.style.setProperty("--beam-color", chosenColor);
    }
  }, [chosenColor, colorLightmode, colorDarkmode, invert, maskLightByProgress]);
  react.useEffect(() => {
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
      const st = ScrollTrigger.ScrollTrigger.create({
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
          const baseOpacity = opacityMin + opacityRange * progress;
          element.style.setProperty("--base-opacity", String(baseOpacity));
          if (!pulse.enabled) {
            element.style.opacity = String(baseOpacity);
          }
        },
        onRefresh: (self) => {
          const progress = calculateProgress(self.progress);
          updateGradientVars(progress);
          updateMaskVars(progress);
          const baseOpacity = opacityMin + opacityRange * progress;
          element.style.setProperty("--base-opacity", String(baseOpacity));
          if (!pulse.enabled) {
            element.style.opacity = String(baseOpacity);
          }
        }
      });
      const initialProgress = calculateProgress(st.progress);
      updateGradientVars(initialProgress);
      updateMaskVars(initialProgress);
      const initialBaseOpacity = opacityMin + opacityRange * initialProgress;
      element.style.setProperty("--base-opacity", String(initialBaseOpacity));
      if (!pulse.enabled) {
        element.style.opacity = String(initialBaseOpacity);
      }
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.ScrollTrigger.refresh();
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
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref: elementRef,
      className: combinedClassName,
      style: finalStyles,
      ...id ? { id } : {},
      children: [
        dustParticles.enabled && /* @__PURE__ */ jsxRuntime.jsx(DustParticles, { config: dustParticles, beamColor: chosenColor }),
        mist.enabled && /* @__PURE__ */ jsxRuntime.jsx(MistEffect, { config: mist, beamColor: chosenColor }),
        pulse.enabled && /* @__PURE__ */ jsxRuntime.jsx(PulseEffect, { config: pulse, containerRef: elementRef })
      ]
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

exports.LightBeam = LightBeam;
//# sourceMappingURL=index.js.map