# @stianlarsen/react-light-beam

[![npm version](https://img.shields.io/npm/v/@stianlarsen/react-light-beam.svg)](https://www.npmjs.com/package/@stianlarsen/react-light-beam)
[![npm downloads](https://img.shields.io/npm/dm/@stianlarsen/react-light-beam.svg)](https://www.npmjs.com/package/@stianlarsen/react-light-beam)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@stianlarsen/react-light-beam)](https://bundlephobia.com/package/@stianlarsen/react-light-beam)
[![license](https://img.shields.io/npm/l/@stianlarsen/react-light-beam.svg)](https://github.com/stianalars1/react-light-beam/blob/main/LICENSE)

A customizable React component that creates a light beam effect using conic gradients. Supports dark mode and various customization options.

![LightBeam Component](https://github.com/Stianlars1/react-light-beam/blob/5422cdc60ae7ab6b52d644d452646bec7212f76f/lightBeam.png)

## Installation

```bash
npm install @stianlarsen/react-light-beam
```

## Requirements

- React 18.0.0 or higher
- framer-motion 10.0.0 or higher

## Usage

```tsx
import { LightBeam } from "@stianlarsen/react-light-beam";

function App() {
  return (
    <div className="container">
      <LightBeam
        className="lightbeam"
        colorDarkmode="rgba(255, 255, 255, 0.8)"
        colorLightmode="rgba(0, 0, 0, 0.2)"
        fullWidth={0.8}
      />
      <YourContent />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | `undefined` | Unique ID for the container element |
| `className` | `string` | `undefined` | CSS class for custom styling |
| `colorLightmode` | `string` | `"rgba(0,0,0, 0.5)"` | Light beam color in light mode |
| `colorDarkmode` | `string` | `"rgba(255,255,255, 0.5)"` | Light beam color in dark mode |
| `fullWidth` | `number` | `1.0` | Maximum width the beam can reach (0-1) |
| `maskLightByProgress` | `boolean` | `false` | Dynamically adjust gradient based on scroll |
| `invert` | `boolean` | `false` | Invert the scroll progress calculation |
| `scrollElement` | `EventTarget` | `window` | Element to attach scroll listener to |
| `onLoaded` | `() => void` | `undefined` | Callback when component mounts |

## Exports

```tsx
// Component
import { LightBeam } from "@stianlarsen/react-light-beam";

// Type
import type { LightBeamProps } from "@stianlarsen/react-light-beam";

// Hook (dark mode detection)
import { useIsDarkmode } from "@stianlarsen/react-light-beam";
```

## Recommended Styling

For best results, position the LightBeam as an absolutely positioned element:

```css
.container {
  position: relative;
}

.lightbeam {
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100%;
  z-index: -1;
  margin-top: -300px;
}
```

## Dark Mode

The component automatically detects system dark mode preferences and switches between `colorLightmode` and `colorDarkmode`.

## Compatibility

- Next.js App Router (RSC)
- Vite
- Create React App
- Any React 18+ project

## License

MIT © [Stian Larsen](https://github.com/stianlarsen)
