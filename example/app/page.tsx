"use client";

import {LightBeam} from "@stianlarsen/react-light-beam";
import {useState} from "react";

export default function Home() {
  const [fullWidth, setFullWidth] = useState(1.0);
  const [invert, setInvert] = useState(false);
  const [maskByProgress, setMaskByProgress] = useState(false);
  const [showControls, setShowControls] = useState(true);

  return (
    <main className="relative min-h-[300vh]">
      {/* Hero Section with LightBeam */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <LightBeam
          colorDarkmode="rgba(255, 255, 255, 0.8)"
          colorLightmode="rgba(0, 0, 0, 0.2)"
          fullWidth={fullWidth}
          invert={invert}
          maskLightByProgress={maskByProgress}
          onLoaded={() => console.log("✅ LightBeam loaded!")}
          className={"absolute z-50 w-full"}
        />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            LightBeam
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            High-performance React scroll animation powered by GSAP
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://github.com/stianalars1/react-light-beam"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              View on GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@stianlarsen/react-light-beam"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/20 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              npm Package
            </a>
          </div>

          {/* Install Command */}
          <div className="mt-12 inline-block bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg px-6 py-4">
            <code className="text-sm text-gray-300">
              npm install @stianlarsen/react-light-beam gsap
            </code>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Interactive Controls */}
      {showControls && (
        <div className="fixed top-4 right-4 z-50 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg p-6 max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Interactive Demo</h3>
            <button
              onClick={() => setShowControls(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                fullWidth: {fullWidth.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={fullWidth}
                onChange={(e) => setFullWidth(parseFloat(e.target.value))}
                className="w-full accent-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Controls maximum beam width (0-1)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Invert Direction</label>
              <input
                type="checkbox"
                checked={invert}
                onChange={(e) => setInvert(e.target.checked)}
                className="w-4 h-4 accent-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Mask by Progress</label>
              <input
                type="checkbox"
                checked={maskByProgress}
                onChange={(e) => setMaskByProgress(e.target.checked)}
                className="w-4 h-4 accent-white"
              />
            </div>
          </div>

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
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why LightBeam?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">
                High Performance
              </h3>
              <p className="text-gray-400">
                Powered by GSAP and ScrollTrigger. 40% faster frame times, 30%
                less CPU usage compared to alternatives.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-3">Fully Customizable</h3>
              <p className="text-gray-400">
                CSS variables, custom colors, dark mode support. Complete
                control over appearance and behavior.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-3">Tiny Bundle</h3>
              <p className="text-gray-400">
                Only 7KB component code. GSAP as peer dependency keeps your
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
              <code>{`import { LightBeam } from "@stianlarsen/react-light-beam";

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
              href="https://github.com/stianalars1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              Stian Larsen
            </a>
          </p>
          <p className="text-sm">
            Powered by GSAP • MIT License • v2.0.0
          </p>
        </div>
      </footer>
    </main>
  );
}
