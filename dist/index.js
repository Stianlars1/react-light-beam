"use client";
'use strict';

var gsap3 = require('gsap');
var ScrollTrigger = require('gsap/ScrollTrigger');
var react = require('@gsap/react');
var react$1 = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var gsap3__default = /*#__PURE__*/_interopDefault(gsap3);

var useIsDarkmode = () => {
  const [isDarkmode, setIsDarkmodeActive] = react$1.useState(false);
  react$1.useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      console.log("Darkmode match?", matchMedia.matches);
      setIsDarkmodeActive(matchMedia.matches);
    };
    setIsDarkmodeActive(matchMedia.matches);
    matchMedia.addEventListener("change", handleChange);
    handleChange();
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
  const particles = react$1.useMemo(() => {
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
  react.useGSAP(
    () => {
      if (!enabled || particles.length === 0) return;
      const timelines = [];
      particles.forEach((particle) => {
        const element = document.getElementById(particle.id);
        if (!element) return;
        const tl = gsap3__default.default.timeline({
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
  const mistLayers = react$1.useMemo(() => {
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
  react.useGSAP(
    () => {
      if (!enabled || mistLayers.length === 0) return;
      const timelines = [];
      mistLayers.forEach((layer) => {
        const element = document.getElementById(layer.id);
        if (!element) return;
        const tl = gsap3__default.default.timeline({
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
  react.useGSAP(
    () => {
      if (!enabled || !containerRef.current) return;
      const element = containerRef.current;
      const timeline = gsap3__default.default.timeline({
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
      const ticker = gsap3__default.default.ticker.add(updateOpacity);
      return () => {
        timeline.kill();
        gsap3__default.default.ticker.remove(ticker);
      };
    },
    {
      dependencies: [enabled, duration, intensity, easing],
      scope: containerRef
    }
  );
  return null;
};
gsap3__default.default.registerPlugin(ScrollTrigger.ScrollTrigger, react.useGSAP);
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
  fullWidth = 0.8,
  // Default to full width range
  invert = false,
  id = void 0,
  onLoaded = void 0,
  scrollElement,
  disableDefaultStyles = false,
  scrollStart = "top bottom",
  scrollEnd = "top top",
  dustParticles = { enabled: false },
  mist = { enabled: false },
  pulse = { enabled: false }
}) => {
  const elementRef = react$1.useRef(null);
  const { isDarkmode } = useIsDarkmode();
  const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;
  const colorRef = react$1.useRef(chosenColor);
  const invertRef = react$1.useRef(invert);
  const maskByProgressRef = react$1.useRef(maskLightByProgress);
  const scrollTriggerRef = react$1.useRef(null);
  react$1.useEffect(() => {
    colorRef.current = chosenColor;
    if (elementRef.current) {
      elementRef.current.style.setProperty("--beam-color", chosenColor);
    }
  }, [chosenColor, colorLightmode, colorDarkmode]);
  react$1.useEffect(() => {
    const prevInvert = invertRef.current;
    invertRef.current = invert;
    if (prevInvert !== invert && scrollTriggerRef.current && elementRef.current) {
      const st = scrollTriggerRef.current;
      elementRef.current;
      st.refresh();
    }
  }, [invert]);
  react$1.useEffect(() => {
    const prevMaskByProgress = maskByProgressRef.current;
    maskByProgressRef.current = maskLightByProgress;
    if (prevMaskByProgress !== maskLightByProgress && elementRef.current) {
      const element = elementRef.current;
      if (maskLightByProgress) {
        element.style.setProperty("--beam-mask-stop", "50%");
        element.style.maskImage = `linear-gradient(to bottom, var(--beam-color) 0%, transparent var(--beam-mask-stop))`;
        element.style.webkitMaskImage = `linear-gradient(to bottom, var(--beam-color) 0%, transparent var(--beam-mask-stop))`;
      } else {
        element.style.maskImage = `linear-gradient(to bottom, var(--beam-color) 25%, transparent 95%)`;
        element.style.webkitMaskImage = `linear-gradient(to bottom, var(--beam-color) 25%, transparent 95%)`;
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.refresh();
      }
    }
  }, [maskLightByProgress]);
  react$1.useEffect(() => {
    onLoaded && onLoaded();
  }, []);
  react.useGSAP(
    () => {
      const element = elementRef.current;
      if (!element || typeof window === "undefined") return;
      const opacityMin = 0.839322;
      const opacityRange = 0.160678;
      const updateColorVar = (color) => {
        element.style.setProperty("--beam-color", color);
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
          // Floor value (1 - fullWidth)
          Math.min(1, 1 - rawProgress)
          // Inverted GSAP progress
        );
        return invertRef.current ? normalizedPosition : 1 - normalizedPosition;
      };
      const scroller = scrollElement ? scrollElement : void 0;
      const applyProgressState = (progress) => {
        const leftPos = 90 - progress * 90;
        const rightPos = 10 + progress * 90;
        const leftSize = 150 - progress * 50;
        const baseOpacity = opacityMin + opacityRange * progress;
        const maskStop = maskByProgressRef.current ? 50 + progress * 45 : void 0;
        const cssProps = {
          "--beam-left-pos": `${leftPos}%`,
          "--beam-right-pos": `${rightPos}%`,
          "--beam-left-size": `${leftSize}%`,
          "--base-opacity": baseOpacity
        };
        if (maskStop !== void 0) {
          cssProps["--beam-mask-stop"] = `${maskStop}%`;
        }
        if (!pulse.enabled) {
          cssProps.opacity = baseOpacity;
        }
        gsap3__default.default.set(element, cssProps);
      };
      initGradientStructure(colorRef.current);
      const st = ScrollTrigger.ScrollTrigger.create({
        trigger: element,
        start: scrollStart,
        // When to start the animation
        end: scrollEnd,
        // When to end the animation
        scroller,
        scrub: true,
        // Instant scrubbing for smooth 60fps
        onUpdate: (self) => {
          const progress = calculateProgress(self.progress);
          applyProgressState(progress);
        },
        onRefresh: (self) => {
          const progress = calculateProgress(self.progress);
          applyProgressState(progress);
        }
      });
      scrollTriggerRef.current = st;
      const initialProgress = calculateProgress(st.progress);
      applyProgressState(initialProgress);
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
        // Affects progress range calculation
        scrollElement,
        // Affects which element to watch
        scrollStart,
        // Affects when animation starts
        scrollEnd
        // Affects when animation ends
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

exports.LightBeam = LightBeam;
//# sourceMappingURL=index.js.map