"use client";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {useRef} from "react";
import {PulseConfig} from "../../types/types";

interface PulseEffectProps {
    config: PulseConfig;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const PulseEffect = ({config, containerRef}: PulseEffectProps) => {
    const {
        enabled = false,
        duration = 2,
        intensity = 0.2,
        easing = "sine.inOut",
    } = config;

    useGSAP(
        () => {
            if (!enabled || !containerRef.current) return;

            const element = containerRef.current;

            // Create pulsing animation using GSAP timeline
            // Pulse multiplies the base opacity (from scroll) with pulse intensity
            const timeline = gsap.timeline({
                repeat: -1, // Infinite loop
                yoyo: true, // Reverse on each iteration
            });

            // Calculate pulse range based on intensity
            // Pulse multiplier varies from (1 - intensity) to (1 + intensity)
            const minMultiplier = Math.max(0, 1 - intensity);
            const maxMultiplier = Math.min(2, 1 + intensity);

            timeline.fromTo(
                element,
                {
                    "--pulse-multiplier": 1,
                },
                {
                    "--pulse-multiplier": maxMultiplier,
                    duration: duration,
                    ease: easing,
                }
            );

            // Apply combined opacity using calc()
            // opacity = base-opacity * pulse-multiplier
            const updateOpacity = () => {
                const baseOpacity = getComputedStyle(element).getPropertyValue('--base-opacity') || '1';
                const pulseMultiplier = getComputedStyle(element).getPropertyValue('--pulse-multiplier') || '1';
                element.style.opacity = `calc(${baseOpacity} * ${pulseMultiplier})`;
            };

            // Update opacity continuously during animation
            const ticker = gsap.ticker.add(updateOpacity);

            return () => {
                timeline.kill();
                gsap.ticker.remove(ticker);
            };
        },
        {
            dependencies: [enabled, duration, intensity, easing],
            scope: containerRef,
        }
    );

    // This component doesn't render anything - it just adds animations
    return null;
};
