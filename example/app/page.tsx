"use client";

import {useState} from "react";
import {LightBeam} from "../../dist/index.mjs";
import styles from "./page.module.css"
import {Heading1, Heading2, Heading3} from "@/lib/typography/typography.react";

const beamColors = {
    BLACK_AND_WHITE: "black_white",
}

export default function Home() {
    const [fullWidth, setFullWidth] = useState(0.8);
    const [invert, setInvert] = useState(false);
    const [maskByProgress, setMaskByProgress] = useState(false);
    const [showControls, setShowControls] = useState(true);

    // Atmospheric Effects
    const [dustEnabled, setDustEnabled] = useState(false);
    const [mistEnabled, setMistEnabled] = useState(false);
    const [pulseEnabled, setPulseEnabled] = useState(false);

    const [lightModeColor, setLightModeColor] = useState("hsl(var(--triadic))");
    const [darkModeColor, setDarkModeColor] = useState("hsl(var(--primary) / 0.75)");


    return (
        <main className="relative min-h-[300vh]">
            {/* Hero Section with LightBeam */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                Scroll...
                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
                    </div>
                </div>
            </section>
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <LightBeam
                    colorDarkmode={darkModeColor}
                    colorLightmode={lightModeColor}
                    fullWidth={fullWidth}
                    invert={invert}
                    maskLightByProgress={maskByProgress}
                    onLoaded={() => console.log("✅ LightBeam loaded!")}
                    className={"max-h:[500px] absolute top:[-100px] inset:[0]"}
                    dustParticles={{enabled: dustEnabled, count: 50, speed: 1.2}}
                    mist={{enabled: mistEnabled, intensity: 0.4, layers: 3}}
                    pulse={{enabled: pulseEnabled, duration: 2.5, intensity: 0.3}}
                />

                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <div className={styles.heroHeader}>

                        <Heading1 className={`text-6xl md:text-8xl font-bold mb-6 ${styles.title}`}>
                            LightBeam
                        </Heading1>
                        <p className={`text-xl md:text-2xl ${styles.subTitle} `}>
                            High-performance React scroll animation powered by GSAP
                        </p>
                    </div>
                    <div className={`flex gap-4 justify-center flex-wrap ${styles.ctaGroup}`}>
                        <a
                            href="https://github.com/stianalars1/react-light-beam"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-6 py-3  rounded-lg font-semibold transition-colors ${styles.primaryCTA}`}

                        >
                            View on GitHub
                        </a>
                        <a
                            href="https://www.npmjs.com/package/@stianlarsen/react-light-beam"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-6 py-3 border  rounded-lg font-semibold  transition-colors ${styles.secondaryCTA}`}
                        >
                            npm Package
                        </a>
                    </div>

                    {/* Install Command */}
                    <div
                        className={`mt-12 inline-block  backdrop-blur-sm border  rounded-lg px-6 py-4 ${styles.codeWrapper}`}>
                        <code className={`text-sm ${styles.code}`}>
                            npm install @stianlarsen/react-light-beam
                        </code>
                    </div>
                </div>

            </section>

            {/* Interactive Controls */}
            {showControls && (
                <div className={`${styles.controllerWrapper}`}>
                    <div className={styles.controllerHeader}>
                        <Heading3 className={styles.controllerTitle}>Interactive Demo</Heading3>
                        <button
                            onClick={() => setShowControls(false)}
                            className={`text-gray-400 hover:text-white ${styles.controllerCloseButton}`}
                        >
                            ✕
                        </button>
                    </div>

                    <section className={styles.controllerSection}>
                        <div className={styles.optionWidthWrapper}>
                            <label className={styles.controllerLabel}>
                                fullWidth: {fullWidth.toFixed(1)}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={fullWidth}
                                onChange={(e) => setFullWidth(parseFloat(e.target.value))}
                                className={styles.rangeInput}
                            />
                            <p className={styles.rangeInputDescription}>
                                Controls maximum beam width (0-1)
                            </p>
                        </div>

                        <div className={styles.labelInputWrapper}>
                            <label className={styles.controllerLabel}>Invert Direction</label>
                            <input
                                type="checkbox"
                                checked={invert}
                                onChange={(e) => setInvert(e.target.checked)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.labelInputWrapper}>
                            <label className={styles.controllerLabel}>Mask by Progress</label>
                            <input
                                type="checkbox"
                                checked={maskByProgress}
                                onChange={(e) => setMaskByProgress(e.target.checked)}
                                className={styles.input}
                            />
                        </div>
                    </section>

                    {/* Atmospheric Effects Section */}
                    <section className={styles.controllerSection}>
                        <h4 className={styles.sectionHeading}>Atmospheric Effects ✨</h4>
                        <div className={styles.controllerSection}>
                            <div className={styles.labelInputWrapper}>
                                <label className={styles.controllerLabel}>Dust Particles</label>
                                <input
                                    type="checkbox"
                                    checked={dustEnabled}
                                    onChange={(e) => setDustEnabled(e.target.checked)}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.labelInputWrapper}>
                                <label className={styles.controllerLabel}>Mist Effect</label>
                                <input
                                    type="checkbox"
                                    checked={mistEnabled}
                                    onChange={(e) => setMistEnabled(e.target.checked)}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.labelInputWrapper}>
                                <label className={styles.controllerLabel}>Pulse Effect</label>
                                <input
                                    type="checkbox"
                                    checked={pulseEnabled}
                                    onChange={(e) => setPulseEnabled(e.target.checked)}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
                        Scroll to see the animation in action
                    </div>
                </div>
            )}

            {!showControls && (
                <button
                    onClick={() => setShowControls(true)}
                    className="fixed top-4 right-4 z-50 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                >
                    Show Controls
                </button>
            )}

            {/* Features Section */}
            <section className={"relative py-32 px-6"}>
                <div className={"max-w-6xl mx-auto"}>
                    <Heading2 className={"text-4xl md:text-5xl font-bold text-center mb-16"}>
                        Why LightBeam?
                    </Heading2>

                    <div className={"grid md:grid-cols-3 gap-8"}>
                        <div className={"bg-white/5 border border-white/10 rounded-lg p-8"}>
                            <div className={"text-4xl mb-4"}>⚡</div>
                            <h3 className={"text-xl font-semibold mb-3"}>
                                High Performance
                            </h3>
                            <p className={"text-gray-400"}>
                                Powered by GSAP and ScrollTrigger. 40% faster frame times, 30%
                                less CPU usage compared to alternatives.
                            </p>
                        </div>

                        <div className={"bg-white/5 border border-white/10 rounded-lg p-8"}>
                            <div className={"text-4xl mb-4"}>🎨</div>
                            <h3 className={"text-xl font-semibold mb-3"}>Fully Customizable</h3>
                            <p className={"text-gray-400"}>
                                CSS variables, custom colors, dark mode support. Complete
                                control over appearance and behavior.
                            </p>
                        </div>

                        <div className={"bg-white/5 border border-white/10 rounded-lg p-8"}>
                            <div className={"text-4xl mb-4"}>📦</div>
                            <h3 className={"text-xl font-semibold mb-3"}>Tiny Bundle</h3>
                            <p className={"text-gray-400"}>
                                Only 31.7KB component code. GSAP as peer dependency keeps your
                                bundle lean (43KB total gzipped).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Example Section */}
            <section className="relative py-32 px-6 bg-white/[0.02]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        Simple to Use
                    </h2>

                    <div className="bg-black/50 border border-white/10 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
              <code style={{fontFamily: "var(--font-jetbrains)"}}>{`import { LightBeam } from "@stianlarsen/react-light-beam";

function App() {
  return (
    <div className="your-container">
      <LightBeam
        colorDarkmode="rgba(255, 255, 255, 0.8)"
        colorLightmode="rgba(0, 0, 0, 0.2)"
        fullWidth={0.8}
        maskLightByProgress={true}
      />
      <YourContent />
    </div>
  );
}`}</code>
            </pre>
                    </div>

                    <div className="mt-8 text-center">
                        <a
                            href="https://github.com/stianalars1/react-light-beam#readme"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                        >
                            Read full documentation →
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-16 px-6 border-t border-white/10">
                <div className="max-w-4xl mx-auto text-center text-gray-400">
                    <p className="mb-4">
                        Built with ❤️ by{" "}
                        <a
                            href="https://github.com/stianlars1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:underline"
                        >
                            Stian Larsen
                        </a>
                    </p>
                    <p className="text-sm">
                        Powered by GSAP • MIT License • v3.0.0
                    </p>
                </div>
            </footer>
        </main>
    );
}
