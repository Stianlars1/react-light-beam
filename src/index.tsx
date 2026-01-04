"use client";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import React, {useEffect, useRef} from "react";
import {LightBeamProps} from "../types/types";
import {useIsDarkmode} from "./hooks/useDarkmode";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

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
    const {isDarkmode} = useIsDarkmode();
    const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;

    // Use a ref to track the current color without triggering useGSAP re-runs
    const colorRef = useRef(chosenColor);

    // Update the ref whenever color changes (dark mode toggle or prop changes)
    useEffect(() => {
        colorRef.current = chosenColor;
    }, [chosenColor, colorLightmode, colorDarkmode]);

    // Call onLoaded callback when component mounts
    useEffect(() => {
        onLoaded && onLoaded();
    }, []);

    // GSAP ScrollTrigger implementation
    useGSAP(
        () => {
            const element = elementRef.current;
            if (!element || typeof window === "undefined") return;

            // Pre-calculate constants for performance
            const opacityMin = 0.839322;
            const opacityRange = 0.160678; // 1 - 0.839322

            // Helper function to interpolate background gradient
            // NOTE: Takes color as parameter to always use current value (not closure!)
            const interpolateBackground = (progress: number, color: string): string => {
                // At progress 0: gradients are wide (90% and 10% positions)
                // At progress 1: gradients converge (0% and 100% positions)
                const leftPos = 90 - progress * 90; // 90% → 0%
                const rightPos = 10 + progress * 90; // 10% → 100%
                const leftSize = 150 - progress * 50; // 150% → 100%

                return `conic-gradient(from 90deg at ${leftPos}% 0%, ${color}, transparent 180deg) 0% 0% / 50% ${leftSize}% no-repeat, conic-gradient(from 270deg at ${rightPos}% 0%, transparent 180deg, ${color}) 100% 0% / 50% 100% no-repeat`;
            };

            // Helper function to interpolate mask
            // NOTE: Takes color as parameter to always use current value (not closure!)
            const interpolateMask = (progress: number, color: string): string => {
                if (!maskLightByProgress) {
                    return `linear-gradient(to bottom, ${color} 25%, transparent 95%)`;
                }
                const stopPoint = 50 + progress * 45; // 50% → 95%
                return `linear-gradient(to bottom, ${color} 0%, transparent ${stopPoint}%)`;
            };

            // EXACT MATCH TO FRAMER MOTION LOGIC:
            // fullWidth controls the MINIMUM beam width, not maximum!
            // fullWidth=1.0 → beam goes from 0% to 100% wide (full range)
            // fullWidth=0.5 → beam goes from 50% to 100% wide (narrower minimum)
            // fullWidth=0.2 → beam goes from 80% to 100% wide (very narrow minimum)
            const adjustedFullWidth = 1 - fullWidth;

            // Helper function to calculate progress (EXACTLY like Framer Motion)
            const calculateProgress = (rawProgress: number): number => {
                // ScrollTrigger rawProgress is 0-1 as element moves from start to end
                // We need to convert this to match Framer's rect.top / windowHeight logic
                // CRITICAL: GSAP progress (0→1) is INVERSE of Framer's normalizedPosition (1→0)

                // Apply fullWidth floor (minimum progress value)
                const normalizedPosition = Math.max(
                    adjustedFullWidth,  // Minimum (floor)
                    Math.min(1, 1 - rawProgress)  // Convert GSAP progress to Framer's normalized position
                );

                // Apply invert logic (EXACTLY like Framer Motion)
                return invert ? normalizedPosition : 1 - normalizedPosition;
            };

            // Determine scroll container
            const scroller = scrollElement
                ? (scrollElement as Element | Window)
                : undefined;

            // Create ScrollTrigger with FIXED range (like Framer Motion)
            const st = ScrollTrigger.create({
                trigger: element,
                start: "top bottom", // Element top hits viewport bottom
                end: "top top", // Element top hits viewport top
                scroller: scroller,
                scrub: true, // Instant scrubbing
                onUpdate: (self) => {
                    // Calculate progress using Framer Motion logic
                    const progress = calculateProgress(self.progress);

                    // Update styles
                    gsap.set(element, {
                        background: interpolateBackground(progress, colorRef.current),
                        opacity: opacityMin + opacityRange * progress,
                        maskImage: interpolateMask(progress, colorRef.current),
                        webkitMaskImage: interpolateMask(progress, colorRef.current),
                    });
                },
                onRefresh: (self) => {
                    // Set initial state when ScrollTrigger refreshes
                    const progress = calculateProgress(self.progress);
                    gsap.set(element, {
                        background: interpolateBackground(progress, colorRef.current),
                        opacity: opacityMin + opacityRange * progress,
                        maskImage: interpolateMask(progress, colorRef.current),
                        webkitMaskImage: interpolateMask(progress, colorRef.current),
                    });
                },
            });

            // Set initial state immediately
            const initialProgress = calculateProgress(st.progress);
            gsap.set(element, {
                background: interpolateBackground(initialProgress, colorRef.current),
                opacity: opacityMin + opacityRange * initialProgress,
                maskImage: interpolateMask(initialProgress, colorRef.current),
                webkitMaskImage: interpolateMask(initialProgress, colorRef.current),
            });

            // Refresh ScrollTrigger after a brief delay to ensure layout is settled
            // This is especially important for Next.js SSR/hydration
            const refreshTimeout = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);

            // Cleanup function to kill ScrollTrigger and clear timeout
            return () => {
                st.kill();
                clearTimeout(refreshTimeout);
            };
        },
        {
            // CRITICAL: Don't include chosenColor in dependencies!
            // We use colorRef.current to get the latest color without recreating ScrollTrigger
            // This prevents the beam from disappearing when color changes (dark mode toggle)
            dependencies: [
                fullWidth,
                invert,
                maskLightByProgress,
                scrollElement,
            ],
            scope: elementRef,
        }
    );

    const combinedClassName = `react-light-beam ${className || ""}`.trim();

    // Prepare final styles (same logic as before, just without MotionValues)
    const finalStyles = disableDefaultStyles
        ? {
            // No default styles, only user styles
            willChange: "background, opacity",
            contain: "layout style paint",
            ...style, // User styles override
        }
        : {
            // Merge default styles with user styles
            ...defaultStyles,
            ...style, // User styles override everything
        };

    return (
        <div
            ref={elementRef}
            className={combinedClassName}
            style={finalStyles}
            {...(id ? {id} : {})}
        />
    );
};



//   <div class="react-light-beam max-h:[500px] absolute top:[-100px] inset:[0]" style="height: var(--react-light-beam-height, 500px); width: var(--react-light-beam-width, 100vw); will-change: background,
//   opacity; pointer-events: none; contain: layout style paint; transition: var(--react-light-beam-transition, all 0.25s ease); mask-image: linear-gradient(rgba(255, 255, 255, 0.8) 25%, transparent 95%);
//   opacity: 0.9434; background: conic-gradient(from 90deg at 31.723% 0%, rgba(255, 255, 255, 0.8), transparent 180deg) 0% 0% / 50% 117.624% no-repeat, conic-gradient(from 270deg at 68.277% 0%, transparent
//   180deg, rgba(255, 255, 255, 0.8)) 100% 0% / 50% 100% no-repeat;"></div>

//   <div class="react-light-beam max-h:[500px] absolute top:[-100px] inset:[0]" style="height: var(--react-light-beam-height, 500px); width: var(--react-light-beam-width, 100vw); will-change: background,
//   opacity; pointer-events: none; contain: layout style paint; transition: var(--react-light-beam-transition, all 0.25s ease); mask-image: linear-gradient(rgba(0, 0, 0, 0.2) 25%, transparent 95%); opacity:
//   0.941; background: conic-gradient(from 90deg at 33.0405% 0%, rgba(0, 0, 0, 0.2), transparent 180deg) 0% 0% / 50% 118.356% no-repeat, conic-gradient(from 270deg at 66.9595% 0%, transparent 180deg, rgba(0, 0,
//   0, 0.2)) 100% 0% / 50% 100% no-repeat;"></div>

