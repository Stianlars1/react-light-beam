"use client";
'use strict';

var gsap2 = require('gsap');
var ScrollTrigger = require('gsap/ScrollTrigger');
var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var gsap2__default = /*#__PURE__*/_interopDefault(gsap2);

var useIsomorphicLayoutEffect = typeof document !== "undefined" ? react.useLayoutEffect : react.useEffect;
var isConfig = (value) => value && !Array.isArray(value) && typeof value === "object";
var emptyArray = [];
var defaultConfig = {};
var _gsap = gsap2__default.default;
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
gsap2__default.default.registerPlugin(ScrollTrigger.ScrollTrigger, useGSAP);
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
  const elementRef = react.useRef(null);
  const { isDarkmode } = useIsDarkmode();
  const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;
  react.useEffect(() => {
    onLoaded && onLoaded();
  }, []);
  useGSAP(
    () => {
      const element = elementRef.current;
      if (!element || typeof window === "undefined") return;
      const adjustedFullWidth = 1 - fullWidth;
      const opacityMin = 0.839322;
      const opacityRange = 0.160678;
      const interpolateBackground = (progress) => {
        const leftPos = 90 - progress * 90;
        const rightPos = 10 + progress * 90;
        const leftSize = 150 - progress * 50;
        return `conic-gradient(from 90deg at ${leftPos}% 0%, ${chosenColor}, transparent 180deg) 0% 0% / 50% ${leftSize}% no-repeat, conic-gradient(from 270deg at ${rightPos}% 0%, transparent 180deg, ${chosenColor}) 100% 0% / 50% 100% no-repeat`;
      };
      const interpolateMask = (progress) => {
        if (!maskLightByProgress) {
          return `linear-gradient(to bottom, ${chosenColor} 25%, transparent 95%)`;
        }
        const stopPoint = 50 + progress * 45;
        return `linear-gradient(to bottom, ${chosenColor} 0%, transparent ${stopPoint}%)`;
      };
      const calculateProgress = (rawProgress) => {
        const clampedProgress = Math.max(
          adjustedFullWidth,
          Math.min(1, rawProgress)
        );
        return invert ? clampedProgress : 1 - clampedProgress;
      };
      const scroller = scrollElement ? scrollElement : void 0;
      ScrollTrigger.ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        // When top of element hits bottom of viewport
        end: "top top",
        // When top of element hits top of viewport
        scroller,
        scrub: 0.3,
        // Smooth scrubbing with 300ms lag for butter-smooth feel
        onUpdate: (self) => {
          const progress = calculateProgress(self.progress);
          gsap2__default.default.set(element, {
            background: interpolateBackground(progress),
            opacity: opacityMin + opacityRange * progress,
            maskImage: interpolateMask(progress),
            webkitMaskImage: interpolateMask(progress)
          });
        },
        onRefresh: (self) => {
          const progress = calculateProgress(self.progress);
          gsap2__default.default.set(element, {
            background: interpolateBackground(progress),
            opacity: opacityMin + opacityRange * progress,
            maskImage: interpolateMask(progress),
            webkitMaskImage: interpolateMask(progress)
          });
        }
      });
      setTimeout(() => {
        ScrollTrigger.ScrollTrigger.refresh();
      }, 100);
    },
    {
      dependencies: [
        chosenColor,
        fullWidth,
        invert,
        maskLightByProgress,
        scrollElement
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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

exports.LightBeam = LightBeam;
//# sourceMappingURL=index.js.map