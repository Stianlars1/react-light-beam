"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightBeam = void 0;
const framer_motion_1 = require("framer-motion");
const react_1 = __importStar(require("react"));
const lightBeam_module_css_1 = __importDefault(require("./css/lightBeam.module.css"));
const useDarkmode_1 = require("./hooks/useDarkmode");
const LightBeam = ({ className, colorLightmode = "rgba(0,0,0, 0.5)", colorDarkmode = "rgba(255, 255, 255, 0.5)", maskLightByProgress = false, fullWidth = 1.0, // Default to full width
invert = false, id = undefined, onLoaded = undefined, }) => {
    const elementRef = (0, react_1.useRef)(null);
    const [bodyElement, setBodyElement] = (0, react_1.useState)(null); // State to hold the body element
    const inViewProgress = (0, framer_motion_1.useMotionValue)(0);
    const opacity = (0, framer_motion_1.useMotionValue)(0.839322);
    const { isDarkmode } = (0, useDarkmode_1.useIsDarkmode)();
    const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;
    (0, react_1.useEffect)(() => {
        // Set the body element after the component mounts
        setBodyElement(document.body);
        onLoaded && onLoaded();
    }, []);
    (0, react_1.useEffect)(() => {
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
    const backgroundPosition = (0, framer_motion_1.useTransform)(inViewProgress, [0, 1], [
        `conic-gradient(from 90deg at 90% 0%, ${chosenColor}, transparent 180deg) 0% 0% / 50% 150% no-repeat, conic-gradient(from 270deg at 10% 0%, transparent 180deg, ${chosenColor}) 100% 0% / 50% 100% no-repeat`,
        `conic-gradient(from 90deg at 0% 0%, ${chosenColor}, transparent 180deg) 0% 0% / 50% 100% no-repeat, conic-gradient(from 270deg at 100% 0%, transparent 180deg, ${chosenColor}) 100% 0% / 50% 100% no-repeat`,
    ]);
    const maskImageOpacity = (0, framer_motion_1.useTransform)(inViewProgress, [0, 1], [
        `linear-gradient(to bottom, ${chosenColor} 0%, transparent 50%)`,
        `linear-gradient(to bottom, ${chosenColor} 0%, transparent 95%)`,
    ]);
    const maskImage = maskLightByProgress
        ? maskImageOpacity
        : `linear-gradient(to bottom, ${chosenColor} 25%, transparent 95%)`;
    return (react_1.default.createElement(framer_motion_1.motion.div, { style: {
            background: backgroundPosition,
            opacity: opacity,
            maskImage: maskImage,
            WebkitMaskImage: maskImage,
        }, ref: elementRef, id: id, className: `lightBeam ${className} ${lightBeam_module_css_1.default.react__light__beam}` }));
};
exports.LightBeam = LightBeam;
