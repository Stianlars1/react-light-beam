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

                // Apply fullWidth floor (minimum progress value)
                const normalizedPosition = Math.max(
                    adjustedFullWidth,  // Minimum (floor)
                    Math.min(1, rawProgress)  // Maximum (ceiling at 1)
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
                        background: interpolateBackground(progress, chosenColor),
                        opacity: opacityMin + opacityRange * progress,
                        maskImage: interpolateMask(progress, chosenColor),
                        webkitMaskImage: interpolateMask(progress, chosenColor),
                    });
                },
                onRefresh: (self) => {
                    // Set initial state when ScrollTrigger refreshes
                    const progress = calculateProgress(self.progress);
                    gsap.set(element, {
                        background: interpolateBackground(progress, chosenColor),
                        opacity: opacityMin + opacityRange * progress,
                        maskImage: interpolateMask(progress, chosenColor),
                        webkitMaskImage: interpolateMask(progress, chosenColor),
                    });
                },
            });

            // Set initial state immediately
            const initialProgress = calculateProgress(st.progress);
            gsap.set(element, {
                background: interpolateBackground(initialProgress, chosenColor),
                opacity: opacityMin + opacityRange * initialProgress,
                maskImage: interpolateMask(initialProgress, chosenColor),
                webkitMaskImage: interpolateMask(initialProgress, chosenColor),
            });

            // Refresh ScrollTrigger after a brief delay to ensure layout is settled
            // This is especially important for Next.js SSR/hydration
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        },
        {
            
            dependencies: [
                chosenColor,
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
