"use client";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {useMemo} from "react";
import {DustParticlesConfig} from "../../types/types";

interface DustParticlesProps {
    config: DustParticlesConfig;
    beamColor: string;
}

export const DustParticles = ({config, beamColor}: DustParticlesProps) => {
    const {
        enabled = false,
        count = 30,
        speed = 1,
        sizeRange = [1, 3],
        opacityRange = [0.2, 0.6],
        color,
    } = config;

    // Generate particle data once
    const particles = useMemo(() => {
        if (!enabled) return [];

        return Array.from({length: count}, (_, i) => {
            // Random position
            const x = Math.random() * 100; // 0-100%
            const y = Math.random() * 100; // 0-100%

            // Random size within range
            const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);

            // Random opacity within range
            const opacity = opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]);

            // Random animation duration (inversely proportional to speed)
            const duration = (3 + Math.random() * 4) / speed; // 3-7s / speed

            // Random animation delay for stagger effect
            const delay = Math.random() * duration;

            return {
                id: `dust-${i}`,
                x,
                y,
                size,
                opacity,
                duration,
                delay,
            };
        });
    }, [enabled, count, sizeRange, opacityRange, speed]);

    useGSAP(
        () => {
            if (!enabled || particles.length === 0) return;

            const timelines: gsap.core.Timeline[] = [];

            particles.forEach((particle) => {
                const element = document.getElementById(particle.id);
                if (!element) return;

                // Create floating animation for each particle
                const tl = gsap.timeline({
                    repeat: -1,
                    yoyo: true,
                    delay: particle.delay,
                });

                // Animate vertical movement and slight horizontal drift
                tl.to(element, {
                    y: `-=${20 + Math.random() * 30}`, // Float upward 20-50px
                    x: `+=${Math.random() * 20 - 10}`, // Slight horizontal drift ±10px
                    opacity: particle.opacity * 0.5, // Fade slightly
                    duration: particle.duration,
                    ease: "sine.inOut",
                });

                timelines.push(tl);
            });

            return () => {
                timelines.forEach((tl) => tl.kill());
            };
        },
        {
            dependencies: [particles, enabled],
        }
    );

    if (!enabled) return null;

    const particleColor = color || beamColor;

    return (
        <>
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    id={particle.id}
                    style={{
                        position: "absolute",
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        borderRadius: "50%",
                        backgroundColor: particleColor,
                        opacity: particle.opacity,
                        pointerEvents: "none",
                        willChange: "transform, opacity",
                    }}
                />
            ))}
        </>
    );
};
