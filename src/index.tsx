"use client";
import {motion, useMotionValue, useTransform} from "framer-motion";
import React, {useEffect, useRef} from "react";
import {LightBeamProps} from "../types/types";
import {useIsDarkmode} from "./hooks/useDarkmode";

// Default inline styles using CSS variables for easy customization
// Users can override via className by setting CSS variables
const defaultStyles: React.CSSProperties = {
    height: "var(--react-light-beam-height, 500px)",
    width: "var(--react-light-beam-width, 100vw)",
    transition: "var(--react-light-beam-transition, all 0.25s ease)",
    willChange: "background, opacity", // Specific properties for better performance
    userSelect: "none",
    pointerEvents: "none",
    contain: "layout style paint", // CSS containment for better performance
    WebkitTransition: "var(--react-light-beam-transition, all 0.25s ease)",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
};

export const LightBeam = ({
                              className,
                              style,
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
    const {isDarkmode} = useIsDarkmode();
    const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;

    useEffect(() => {
        onLoaded && onLoaded();
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return

        // Cache values that don't change during scroll (MAJOR OPTIMIZATION)
        let cachedWindowHeight = window.innerHeight;
        const adjustedFullWidth = 1 - fullWidth; // Only calculate once
        const opacityMin = 0.839322;
        const opacityRange = 1 - opacityMin; // Pre-calculate: 0.160678
        let lastProgress = -1;

        const handleScroll = () => {
            if (!elementRef.current) return;

            // OPTIMIZATION: Only call getBoundingClientRect (expensive!)
            const rect = elementRef.current.getBoundingClientRect();

            // Calculate normalized position (0-1 range)
            const normalizedPosition = Math.max(
                adjustedFullWidth,
                Math.min(1, rect.top / cachedWindowHeight)
            );

            // Calculate progress (only once, not twice like before!)
            const progress = invert ? normalizedPosition : 1 - normalizedPosition;

            // Only update if change is significant (avoid micro-updates)
            if (Math.abs(progress - lastProgress) > 0.001) {
                lastProgress = progress;
                // Batch updates together
                inViewProgress.set(progress);
                opacity.set(opacityMin + opacityRange * progress);
            }
        };

        const handleResize = () => {
            cachedWindowHeight = window.innerHeight; // Update cache on resize
            handleScroll(); // Recalculate immediately
        };

        const handleScrollThrottled = throttle(handleScroll);
        const handleResizeThrottled = throttle(handleResize);

        // Default to document.body (works in modern React/Next.js setups)
        const target = scrollElement || document.body || document.documentElement;

        // Passive listeners improve scroll performance significantly
        target.addEventListener("scroll", handleScrollThrottled, {passive: true});
        window.addEventListener("resize", handleResizeThrottled, {passive: true});

        // Initial call to set state
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

    // CRITICAL: MotionValues must be passed directly to motion.div style prop
    // Don't spread them into plain objects or reactivity breaks!
    const finalStyles = disableDefaultStyles
        ? {
            // No default styles, only motion values and user styles
            background: backgroundPosition,
            opacity: opacity,
            maskImage: maskImage,
            WebkitMaskImage: maskImage,
            willChange: "background, opacity",
            contain: "layout style paint", // CSS containment for better performance
            ...style, // User styles override
        }
        : {
            // Merge default styles with motion values
            ...defaultStyles,
            background: backgroundPosition, // MotionValue (overrides default)
            opacity: opacity,                // MotionValue (overrides default)
            maskImage: maskImage,            // MotionValue or string
            WebkitMaskImage: maskImage,
            willChange: "background, opacity",
            ...style, // User styles override everything
        };

    const motionProps: any = {
        style: finalStyles,
        ref: elementRef,
        className: combinedClassName,
        ...(id ? {id} : {}),
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
