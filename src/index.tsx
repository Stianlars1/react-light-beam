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
                              fullWidth = 1.0, // Default to full width range
                              invert = false,
                              id = undefined,
                              onLoaded = undefined,
                              scrollElement,
                              disableDefaultStyles = false,
                              scrollStart = "top bottom",
                              scrollEnd = "top top",
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

    // Store ScrollTrigger instance for manual updates
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    // Update refs whenever values change
    useEffect(() => {
        colorRef.current = chosenColor;

        // PERFORMANCE: Update color CSS variable when color changes
        // This avoids recreating ScrollTrigger on color changes
        if (elementRef.current) {
            elementRef.current.style.setProperty('--beam-color', chosenColor);
        }
    }, [chosenColor, colorLightmode, colorDarkmode]);

    // Handle invert changes separately - needs immediate update
    useEffect(() => {
        const prevInvert = invertRef.current;
        invertRef.current = invert;

        // If invert changed and ScrollTrigger exists, immediately update
        if (prevInvert !== invert && scrollTriggerRef.current && elementRef.current) {
            const st = scrollTriggerRef.current;
            const element = elementRef.current;

            // Force immediate recalculation with new invert value
            // This prevents lag/jitter when toggling invert during scroll
            st.refresh();
        }
    }, [invert]);

    // Handle maskLightByProgress changes separately - needs structure rebuild
    useEffect(() => {
        const prevMaskByProgress = maskByProgressRef.current;
        maskByProgressRef.current = maskLightByProgress;

        // If maskLightByProgress changed and element exists, rebuild mask structure
        if (prevMaskByProgress !== maskLightByProgress && elementRef.current) {
            const element = elementRef.current;

            // Rebuild mask gradient structure with new setting
            if (maskLightByProgress) {
                // Initialize mask stop value
                element.style.setProperty('--beam-mask-stop', '50%');
                element.style.maskImage = `linear-gradient(to bottom, var(--beam-color) 0%, transparent var(--beam-mask-stop))`;
                element.style.webkitMaskImage = `linear-gradient(to bottom, var(--beam-color) 0%, transparent var(--beam-mask-stop))`;
            } else {
                // Static mask
                element.style.maskImage = `linear-gradient(to bottom, var(--beam-color) 25%, transparent 95%)`;
                element.style.webkitMaskImage = `linear-gradient(to bottom, var(--beam-color) 25%, transparent 95%)`;
            }

            // If ScrollTrigger exists, refresh to apply current state
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.refresh();
            }
        }
    }, [maskLightByProgress]);

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

            // Helper function to set color (only when color changes, not every frame)
            const updateColorVar = (color: string): void => {
                element.style.setProperty('--beam-color', color);
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

            // FRAMER MOTION LOGIC (PRESERVED):
            // fullWidth controls the MAXIMUM beam width expansion during scroll
            // fullWidth=1.0 → beam expands from 0% to 100% of maximum width (full range)
            // fullWidth=0.8 → beam expands from 0% to 80% of maximum width
            // fullWidth=0.5 → beam expands from 0% to 50% of maximum width
            // fullWidth=0.2 → beam expands from 0% to 20% of maximum width
            const adjustedFullWidth = 1 - fullWidth;

            // Helper function to calculate progress (EXACTLY like Framer Motion)
            const calculateProgress = (rawProgress: number): number => {
                // ScrollTrigger rawProgress: 0 (element entering) → 1 (element at trigger end)
                // We convert to match Framer's rect.top / windowHeight logic
                // GSAP progress (0→1) is INVERSE of Framer's normalizedPosition (1→0)

                // Apply fullWidth ceiling (maximum progress value)
                // Math.max ensures progress never goes below (1 - fullWidth)
                // This limits how much the beam can expand
                const normalizedPosition = Math.max(
                    adjustedFullWidth,  // Floor value (1 - fullWidth)
                    Math.min(1, 1 - rawProgress)  // Inverted GSAP progress
                );

                // Apply invert logic (EXACTLY like Framer Motion)
                // Use invertRef to get current value without closure issues
                return invertRef.current ? normalizedPosition : 1 - normalizedPosition;
            };

            // Determine scroll container
            const scroller = scrollElement
                ? (scrollElement as Element | Window)
                : undefined;

            // PERFORMANCE OPTIMIZATION: Shared update function to avoid code duplication
            // Batches all style updates for better performance
            const applyProgressState = (progress: number): void => {
                // Pre-calculate all values
                const leftPos = 90 - progress * 90;
                const rightPos = 10 + progress * 90;
                const leftSize = 150 - progress * 50;
                const baseOpacity = opacityMin + opacityRange * progress;
                const maskStop = maskByProgressRef.current ? 50 + progress * 45 : undefined;

                // BATCH UPDATE: Use single gsap.set() call instead of multiple setProperty()
                // This is significantly faster as GSAP batches all updates in one frame
                const cssProps: any = {
                    '--beam-left-pos': `${leftPos}%`,
                    '--beam-right-pos': `${rightPos}%`,
                    '--beam-left-size': `${leftSize}%`,
                    '--base-opacity': baseOpacity,
                };

                // Conditionally add mask stop
                if (maskStop !== undefined) {
                    cssProps['--beam-mask-stop'] = `${maskStop}%`;
                }

                // Conditionally add opacity (only if pulse not enabled)
                if (!pulse.enabled) {
                    cssProps.opacity = baseOpacity;
                }

                // Single batch update via GSAP (more efficient than multiple setProperty calls)
                gsap.set(element, cssProps);
            };

            // Initialize gradient structure once
            initGradientStructure(colorRef.current);

            // Create ScrollTrigger with customizable start/end positions
            // SCRUB VALUE EXPLANATION:
            // - scrub: true (or 1) = 1 second catch-up delay (causes visible lag and stuttering)
            // - scrub: 0.3 = 300ms catch-up (fast and smooth, optimal for UI) ← CURRENT SETTING
            // - scrub: 0 = instant (may feel jittery on fast scrolls, no smoothing)
            // Research: Lower values (0.2-0.5) recommended for responsive scroll UX
            const st = ScrollTrigger.create({
                trigger: element,
                start: scrollStart, // When to start the animation
                end: scrollEnd, // When to end the animation
                scroller: scroller,
                scrub: 0.3, // Fast catch-up (300ms) for responsive scroll without jitter
                onUpdate: (self) => {
                    // Calculate progress using Framer Motion logic
                    const progress = calculateProgress(self.progress);

                    // Apply all updates in single batch
                    applyProgressState(progress);
                },
                onRefresh: (self) => {
                    // CRITICAL: ScrollTrigger.refresh() is called on window resize, orientation change,
                    // or when content changes. We need to recalculate and reapply styles to ensure
                    // the beam renders correctly after layout changes.
                    const progress = calculateProgress(self.progress);

                    // Apply all updates in single batch
                    applyProgressState(progress);
                },
            });

            // Store ScrollTrigger instance for manual updates (invert/maskLightByProgress changes)
            scrollTriggerRef.current = st;

            // Set initial state immediately using batched update
            const initialProgress = calculateProgress(st.progress);
            applyProgressState(initialProgress);

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
                fullWidth,  // Affects progress range calculation
                scrollElement,  // Affects which element to watch
                scrollStart,  // Affects when animation starts
                scrollEnd,  // Affects when animation ends
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
                <DustParticles config={dustParticles} beamColor={chosenColor}/>
            )}
            {mist.enabled && (
                <MistEffect config={mist} beamColor={chosenColor}/>
            )}
            {pulse.enabled && (
                <PulseEffect config={pulse} containerRef={elementRef}/>
            )}
        </div>
    );
};
