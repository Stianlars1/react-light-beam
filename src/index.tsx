"use client";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import React, {useEffect, useRef} from "react";
import {LightBeamProps} from "../types/types";
import {useIsDarkmode} from "./hooks/useDarkmode";
import {DustParticles} from "./effects/DustParticles";
import {MistEffect} from "./effects/MistEffect";
import {PulseEffect} from "./effects/PulseEffect";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Default inline styles using CSS variables for easy customization
// Users can override via className by setting CSS variables
const defaultStyles: React.CSSProperties = {
    height: "var(--react-light-beam-height, 500px)",
    width: "var(--react-light-beam-width, 100vw)",
    // CRITICAL: NO transition on GSAP-controlled properties (background, opacity, mask)
    // Transitions would fight with GSAP's instant updates, causing visual glitches
    // especially when scroll direction changes
    transition: "none",
    willChange: "background, opacity", // Specific properties for better performance
    userSelect: "none",
    pointerEvents: "none",
    contain: "layout style paint", // CSS containment for better performance
    WebkitTransition: "none",
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
                              dustParticles = {enabled: false},
                              mist = {enabled: false},
                              pulse = {enabled: false},
                          }: LightBeamProps) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const {isDarkmode} = useIsDarkmode();
    const chosenColor = isDarkmode ? colorDarkmode : colorLightmode;

    // Use refs to track current values without triggering useGSAP re-runs
    const colorRef = useRef(chosenColor);
    const invertRef = useRef(invert);
    const maskByProgressRef = useRef(maskLightByProgress);

    // Update refs whenever values change
    useEffect(() => {
        colorRef.current = chosenColor;
        invertRef.current = invert;
        maskByProgressRef.current = maskLightByProgress;

        // PERFORMANCE: Update color CSS variable when color changes
        // This avoids recreating ScrollTrigger on color changes
        if (elementRef.current) {
            elementRef.current.style.setProperty('--beam-color', chosenColor);
        }
    }, [chosenColor, colorLightmode, colorDarkmode, invert, maskLightByProgress]);

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

            // PERFORMANCE OPTIMIZATION: Use CSS custom properties instead of string interpolation
            // This avoids expensive string concatenation and gradient parsing on every scroll frame
            // We update numeric values only, browser handles gradient recalculation efficiently
            const updateGradientVars = (progress: number): void => {
                // At progress 0: gradients are wide (90% and 10% positions)
                // At progress 1: gradients converge (0% and 100% positions)
                const leftPos = 90 - progress * 90; // 90% → 0%
                const rightPos = 10 + progress * 90; // 10% → 100%
                const leftSize = 150 - progress * 50; // 150% → 100%

                // Update CSS variables (much faster than full gradient string replacement)
                element.style.setProperty('--beam-left-pos', `${leftPos}%`);
                element.style.setProperty('--beam-right-pos', `${rightPos}%`);
                element.style.setProperty('--beam-left-size', `${leftSize}%`);
            };

            // Helper function to set color (only when color changes, not every frame)
            const updateColorVar = (color: string): void => {
                element.style.setProperty('--beam-color', color);
            };

            // Helper function to interpolate mask stop point
            const updateMaskVars = (progress: number): void => {
                if (maskByProgressRef.current) {
                    const stopPoint = 50 + progress * 45; // 50% → 95%
                    element.style.setProperty('--beam-mask-stop', `${stopPoint}%`);
                }
            };

            // Set initial gradient structure (once, not per frame!)
            const initGradientStructure = (color: string): void => {
                updateColorVar(color);
                const baseGradient = `conic-gradient(from 90deg at var(--beam-left-pos) 0%, var(--beam-color), transparent 180deg) 0% 0% / 50% var(--beam-left-size) no-repeat, conic-gradient(from 270deg at var(--beam-right-pos) 0%, transparent 180deg, var(--beam-color)) 100% 0% / 50% 100% no-repeat`;
                element.style.background = baseGradient;

                // Set mask structure
                if (maskByProgressRef.current) {
                    element.style.maskImage = `linear-gradient(to bottom, var(--beam-color) 0%, transparent var(--beam-mask-stop))`;
                    element.style.webkitMaskImage = `linear-gradient(to bottom, var(--beam-color) 0%, transparent var(--beam-mask-stop))`;
                } else {
                    element.style.maskImage = `linear-gradient(to bottom, var(--beam-color) 25%, transparent 95%)`;
                    element.style.webkitMaskImage = `linear-gradient(to bottom, var(--beam-color) 25%, transparent 95%)`;
                }
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
                // Use invertRef to get current value without closure issues
                return invertRef.current ? normalizedPosition : 1 - normalizedPosition;
            };

            // Determine scroll container
            const scroller = scrollElement
                ? (scrollElement as Element | Window)
                : undefined;

            // Initialize gradient structure once
            initGradientStructure(colorRef.current);

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

                    // OPTIMIZED: Only update numeric CSS variables, not full gradient strings
                    updateGradientVars(progress);
                    updateMaskVars(progress);

                    // Set base opacity as CSS variable so pulse can multiply it
                    const baseOpacity = opacityMin + opacityRange * progress;
                    element.style.setProperty('--base-opacity', String(baseOpacity));

                    // If pulse is not enabled, set opacity directly
                    if (!pulse.enabled) {
                        element.style.opacity = String(baseOpacity);
                    }
                },
                onRefresh: (self) => {
                    // Set initial state when ScrollTrigger refreshes
                    const progress = calculateProgress(self.progress);
                    updateGradientVars(progress);
                    updateMaskVars(progress);

                    const baseOpacity = opacityMin + opacityRange * progress;
                    element.style.setProperty('--base-opacity', String(baseOpacity));

                    if (!pulse.enabled) {
                        element.style.opacity = String(baseOpacity);
                    }
                },
            });

            // Set initial state immediately
            const initialProgress = calculateProgress(st.progress);
            updateGradientVars(initialProgress);
            updateMaskVars(initialProgress);

            const initialBaseOpacity = opacityMin + opacityRange * initialProgress;
            element.style.setProperty('--base-opacity', String(initialBaseOpacity));

            if (!pulse.enabled) {
                element.style.opacity = String(initialBaseOpacity);
            }

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
            // CRITICAL: Use refs for frequently changing values!
            // colorRef, invertRef, maskByProgressRef allow updates without recreating ScrollTrigger
            // This prevents visual glitches when these values change mid-scroll
            // Only include values that affect ScrollTrigger's position/range calculations
            dependencies: [
                fullWidth,  // Affects trigger range
                scrollElement,  // Affects which element to watch
            ],
            scope: elementRef,
        }
    );

    const combinedClassName = `react-light-beam ${className || ""}`.trim();

    // Prepare final styles
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
        >
            {/* Atmospheric Effects */}
            {dustParticles.enabled && (
                <DustParticles config={dustParticles} beamColor={chosenColor} />
            )}
            {mist.enabled && (
                <MistEffect config={mist} beamColor={chosenColor} />
            )}
            {pulse.enabled && (
                <PulseEffect config={pulse} containerRef={elementRef} />
            )}
        </div>
    );
};
