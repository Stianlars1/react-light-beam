"use client";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {useMemo} from "react";
import {MistConfig} from "../../types/types";

interface MistEffectProps {
    config: MistConfig;
    beamColor: string;
}

export const MistEffect = ({config, beamColor}: MistEffectProps) => {
    const {
        enabled = false,
        intensity = 0.3,
        speed = 1,
        layers = 2,
    } = config;

    // Generate mist layer data
    const mistLayers = useMemo(() => {
        if (!enabled) return [];

        return Array.from({length: layers}, (_, i) => {
            // Each layer has different characteristics for depth
            const layerOpacity = (intensity * 0.6) / (i + 1); // Deeper layers are more transparent
            const duration = (8 + i * 3) / speed; // Deeper layers move slower
            const delay = (i * 1.5) / speed; // Stagger start times
            const scale = 1 + i * 0.2; // Deeper layers are larger

            return {
                id: `mist-layer-${i}`,
                opacity: layerOpacity,
                duration,
                delay,
                scale,
            };
        });
    }, [enabled, intensity, speed, layers]);

    useGSAP(
        () => {
            if (!enabled || mistLayers.length === 0) return;

            const timelines: gsap.core.Timeline[] = [];

            mistLayers.forEach((layer) => {
                const element = document.getElementById(layer.id);
                if (!element) return;

                // Create drifting mist animation
                const tl = gsap.timeline({
                    repeat: -1,
                    yoyo: false,
                });

                // Horizontal drift animation
                tl.fromTo(
                    element,
                    {
                        x: "-100%",
                        opacity: 0,
                    },
                    {
                        x: "100%",
                        opacity: layer.opacity,
                        duration: layer.duration,
                        ease: "none",
                        delay: layer.delay,
                    }
                ).to(element, {
                    opacity: 0,
                    duration: layer.duration * 0.2,
                    ease: "power1.in",
                });

                timelines.push(tl);
            });

            return () => {
                timelines.forEach((tl) => tl.kill());
            };
        },
        {
            dependencies: [mistLayers, enabled],
        }
    );

    if (!enabled) return null;

    // Parse beam color and create mist color with lower opacity
    const mistColor = beamColor.replace(/[\d.]+\)$/g, `${intensity})`);

    return (
        <>
            {mistLayers.map((layer) => (
                <div
                    key={layer.id}
                    id={layer.id}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: `radial-gradient(ellipse 120% 80% at 50% 20%, ${mistColor}, transparent 70%)`,
                        opacity: 0,
                        pointerEvents: "none",
                        willChange: "transform, opacity",
                        transform: `scale(${layer.scale})`,
                        filter: "blur(40px)",
                    }}
                />
            ))}
        </>
    );
};
