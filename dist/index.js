"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  LightBeam: () => LightBeam,
  useIsDarkmode: () => useIsDarkmode
});
module.exports = __toCommonJS(index_exports);
var import_framer_motion = require("framer-motion");
var import_react2 = require("react");

// src/hooks/useDarkmode.tsx
var import_react = require("react");
var useIsDarkmode = () => {
  const [isDarkmode, setIsDarkmodeActive] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
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

// src/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var defaultStyles = {
  height: "500px",
  width: "100vw",
  transition: "all 0.25s ease",
  willChange: "background, opacity",
  userSelect: "none",
  pointerEvents: "none"
};
var LightBeam = ({
  className,
  colorLightmode = "rgba(0,0,0, 0.5)",
  colorDarkmode = "rgba(255, 255, 255, 0.5)",
  maskLightByProgress = false,
  fullWidth = 1,
  invert = false,
  id,
  onLoaded,
  scrollElement
}) => {
  const elementRef = (0, import_react2.useRef)(null);
  const inViewProgress = (0, import_framer_motion.useMotionValue)(0);
  const opacity = (0, import_framer_motion.useMotionValue)(0.839322);
  const { isDarkmode } = useIsDarkmode();
  const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;
  (0, import_react2.useEffect)(() => {
    onLoaded?.();
  }, []);
  (0, import_react2.useEffect)(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const adjustedFullWidth = 1 - fullWidth;
        const progress = invert ? 0 + Math.max(adjustedFullWidth, Math.min(1, rect.top / windowHeight)) : 1 - Math.max(adjustedFullWidth, Math.min(1, rect.top / windowHeight));
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
  const backgroundPosition = (0, import_framer_motion.useTransform)(
    inViewProgress,
    [0, 1],
    [
      `conic-gradient(from 90deg at 90% 0%, ${chosenColor}, transparent 180deg) 0% 0% / 50% 150% no-repeat, conic-gradient(from 270deg at 10% 0%, transparent 180deg, ${chosenColor}) 100% 0% / 50% 100% no-repeat`,
      `conic-gradient(from 90deg at 0% 0%, ${chosenColor}, transparent 180deg) 0% 0% / 50% 100% no-repeat, conic-gradient(from 270deg at 100% 0%, transparent 180deg, ${chosenColor}) 100% 0% / 50% 100% no-repeat`
    ]
  );
  const maskImageOpacity = (0, import_framer_motion.useTransform)(
    inViewProgress,
    [0, 1],
    [
      `linear-gradient(to bottom, ${chosenColor} 0%, transparent 50%)`,
      `linear-gradient(to bottom, ${chosenColor} 0%, transparent 95%)`
    ]
  );
  const maskImage = maskLightByProgress ? maskImageOpacity : `linear-gradient(to bottom, ${chosenColor} 25%, transparent 95%)`;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_framer_motion.motion.div,
    {
      style: {
        ...defaultStyles,
        background: backgroundPosition,
        opacity,
        maskImage,
        WebkitMaskImage: maskImage
      },
      ref: elementRef,
      id,
      className
    }
  );
};
var throttle = (func) => {
  let ticking = false;
  return function() {
    if (!ticking) {
      requestAnimationFrame(() => {
        func();
        ticking = false;
      });
      ticking = true;
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LightBeam,
  useIsDarkmode
});
//# sourceMappingURL=index.js.map