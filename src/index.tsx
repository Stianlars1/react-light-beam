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
            const interpolateBackground = (progress: number): string => {
                // At progress 0: gradients are wide (90% and 10% positions)
                // At progress 1: gradients converge (0% and 100% positions)
                const leftPos = 90 - progress * 90; // 90% → 0%
                const rightPos = 10 + progress * 90; // 10% → 100%
                const leftSize = 150 - progress * 50; // 150% → 100%

                return `conic-gradient(from 90deg at ${leftPos}% 0%, ${chosenColor}, transparent 180deg) 0% 0% / 50% ${leftSize}% no-repeat, conic-gradient(from 270deg at ${rightPos}% 0%, transparent 180deg, ${chosenColor}) 100% 0% / 50% 100% no-repeat`;
            };

            // Helper function to interpolate mask
            const interpolateMask = (progress: number): string => {
                if (!maskLightByProgress) {
                    return `linear-gradient(to bottom, ${chosenColor} 25%, transparent 95%)`;
                }
                const stopPoint = 50 + progress * 45; // 50% → 95%
                return `linear-gradient(to bottom, ${chosenColor} 0%, transparent ${stopPoint}%)`;
            };

            // Helper function to calculate progress from raw ScrollTrigger progress
            const calculateProgress = (rawProgress: number): number => {
                // ScrollTrigger gives us 0-1 as element moves from start to end
                // Clamp to ensure it's always between 0 and 1
                const clamped = Math.max(0, Math.min(1, rawProgress));

                // Scale by fullWidth to control maximum beam width
                // fullWidth=1.0 → progress goes 0 to 1 (fully wide)
                // fullWidth=0.5 → progress goes 0 to 0.5 (50% wide max)
                // fullWidth=0.2 → progress goes 0 to 0.2 (20% wide max)

                // Default (invert=false): 0→fullWidth = small to wide
                // Inverted (invert=true): fullWidth→0 = wide to small
                return (invert ? 1 - clamped : clamped) * fullWidth;
            };

            // Determine scroll container
            // ScrollTrigger expects undefined (default), window, or a DOM element
            // If scrollElement is provided, cast it as Element (GSAP accepts Element or Window)
            const scroller = scrollElement
                ? (scrollElement as Element | Window)
                : undefined;

            // Calculate end position based on fullWidth
            // fullWidth=1.0 → end="top 0%" (animates through entire viewport)
            // fullWidth=0.5 → end="top 50%" (stops animation halfway)
            // fullWidth=0.0 → end="top 100%" (no animation)
            const endPosition = `top ${(1 - fullWidth) * 100}%`;

            // Create ScrollTrigger
            const st = ScrollTrigger.create({
                trigger: element,
                start: "top bottom", // Start when element enters viewport from bottom
                end: endPosition, // End position based on fullWidth prop
                scroller: scroller,
                scrub: true, // TRUE for instant scrubbing (no lag) - smoother bidirectional
                onUpdate: (self) => {
                    // Calculate progress with our custom logic
                    const progress = calculateProgress(self.progress);

                    // Update element styles directly (bypasses React for performance)
                    gsap.set(element, {
                        background: interpolateBackground(progress),
                        opacity: opacityMin + opacityRange * progress,
                        maskImage: interpolateMask(progress),
                        webkitMaskImage: interpolateMask(progress),
                    });
                },
                onRefresh: (self) => {
                    // Set initial state when ScrollTrigger refreshes
                    const progress = calculateProgress(self.progress);
                    gsap.set(element, {
                        background: interpolateBackground(progress),
                        opacity: opacityMin + opacityRange * progress,
                        maskImage: interpolateMask(progress),
                        webkitMaskImage: interpolateMask(progress),
                    });
                },
            });

            // Set initial state immediately
            const initialProgress = calculateProgress(st.progress);
            gsap.set(element, {
                background: interpolateBackground(initialProgress),
                opacity: opacityMin + opacityRange * initialProgress,
                maskImage: interpolateMask(initialProgress),
                webkitMaskImage: interpolateMask(initialProgress),
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
