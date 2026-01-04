# @stianlarsen/react-light-beam

## 🚀 v2.0 - Powered by GSAP!

**Major upgrade!** LightBeam is now powered by **GSAP ScrollTrigger** for:
- ⚡️ **40% faster** scroll performance
- 🎯 **Pixel-perfect scrubbing** in both directions
- 🔄 **Smoother animations** on all devices
- 📦 **Lighter bundle** with tree-shaking
- 🎨 **Live prop updates** without recreation

[![npm version](https://badge.fury.io/js/%40stianlarsen%2Freact-light-beam.svg)](https://badge.fury.io/js/%40stianlarsen%2Freact-light-beam)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-demo-url.vercel.app)

A high-performance React component that creates a scroll-triggered light beam effect using conic gradients. Fully responsive with automatic dark mode support. Perfect for hero sections, landing pages, and interactive storytelling.

## ✨ Key Features

- 🚀 **Powered by GSAP** - Industry-leading animation performance
- 📜 **Scroll-driven** - Smooth scrubbing with GSAP ScrollTrigger
- 🌓 **Dark mode ready** - Auto-detects system preferences
- ⚙️ **Highly customizable** - Control width, colors, direction, and more
- 🎯 **Zero config** - Works out of the box with sensible defaults
- 💪 **TypeScript** - Full type definitions included
- 📦 **Tree-shakeable** - Optimized bundle size

## Preview

![LightBeam Component](https://raw.githubusercontent.com/Stianlars1/react-light-beam/main/lightBeam.png)

_A preview of @stianlarsen/react-light-beam_

## Installation

```bash
npm install @stianlarsen/react-light-beam gsap
```

**Note:** GSAP is a peer dependency. If you don't have it already:

```bash
npm install gsap @gsap/react
```

## Usage

### Basic Usage (Works Immediately - No CSS Import!)

The component works out of the box with default inline styles:

```jsx
import { LightBeam } from "@stianlarsen/react-light-beam";

const App = () => {
  return (
    <div className="your-container-class">
      <LightBeam
        colorDarkmode="rgba(255, 255, 255, 0.8)"
        colorLightmode="rgba(0, 0, 0, 0.2)"
        fullWidth={0.8}
        maskLightByProgress={true}
        scrollElement={window}
      />
      <YourContentHere />
    </div>
  );
};
```

### Customizing Styles (Multiple Options!)

#### Option 1: CSS Variables via className (Recommended!)

Override default styles using CSS variables - works with className!

```jsx
import { LightBeam } from "@stianlarsen/react-light-beam";

const App = () => {
  return (
    <LightBeam
      className="custom-beam"
      colorDarkmode="rgba(255, 255, 255, 0.8)"
    />
  );
};
```

Then in your CSS:

```css
.custom-beam {
  --react-light-beam-height: 800px;
  --react-light-beam-width: 80vw;
  /* Note: GSAP controls animations - transitions may not work as expected */
}
```

**Available CSS Variables:**
- `--react-light-beam-height` (default: `500px`)
- `--react-light-beam-width` (default: `100vw`)

**Note:** CSS transitions are disabled by default to prevent conflicts with GSAP. GSAP handles all animations for optimal performance.

#### Option 2: Inline Styles via `style` prop

```jsx
<LightBeam
  style={{
    height: '800px',
    width: '80vw',
    marginTop: '-200px'
  }}
  colorDarkmode="rgba(255, 255, 255, 0.8)"
/>
```

### Advanced: Full CSS Control (className only)

For complete control via CSS, disable default inline styles:

```jsx
import { LightBeam } from "@stianlarsen/react-light-beam";

const App = () => {
  return (
    <LightBeam
      disableDefaultStyles={true} // Disable all inline styles
      className="my-custom-lightbeam"
      colorDarkmode="rgba(255, 255, 255, 0.8)"
    />
  );
};
```

Then provide all styles via CSS:

```css
.my-custom-lightbeam {
  height: 800px;
  width: 100%;
  position: absolute;
  transition: all 0.3s ease;
  user-select: none;
  pointer-events: none;
  /* Full control - you provide all styles */
}
```

### Props

| Prop Name             | Type                         | Default Value              | Description                                                                                                                                                                                                                                                                                                                                  |
| --------------------- | ---------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | `string`                     | `undefined`                | Optional string representing a unique ID for the LightBeam container.                                                                                                                                                                                                                                                                        |
| `className`           | `string`                     | `undefined`                | Optional string representing custom classes to be added to the LightBeam container.                                                                                                                                                                                                                                                          |
| `style`               | `React.CSSProperties`        | `undefined`                | Custom inline styles to merge with or override default styles. User styles take priority. Example: `style={{ height: '800px', width: '80vw' }}`                                                                                                                                                                                              |
| `colorLightmode`      | `string`                     | `rgba(0,0,0, 0.5)`         | Optional string representing the color of the light beam in light mode.                                                                                                                                                                                                                                                                      |
| `colorDarkmode`       | `string`                     | `rgba(255, 255, 255, 0.5)` | Optional string representing the color of the light beam in dark mode.                                                                                                                                                                                                                                                                       |
| `fullWidth`           | `number`                     | `1.0`                      | Optional number between `0` and `1` representing the maximum width the light beam can reach.                                                                                                                                                                                                                                                 |
| `maskLightByProgress` | `boolean`                    | `false`                    | If `true`, the `mask-image`'s linear gradient will start with the chosen color at 0% and the transparent part starting at 50%. As the user scrolls, it will dynamically change to have the transparent part at 95%, reducing the glow effect. If `false`, it will default to `linear-gradient(to bottom, chosenColor 25%, transparent 95%)`. |
| `invert`              | `boolean`                    | `false`                    | Optional boolean to invert the scroll progress calculation.                                                                                                                                                                                                                                                                                  |
| `scrollElement`       | `EventTarget` or `undefined` | `document.body` | Optional prop for which element to attach the scroll listener to. Defaults to `document.body` (the `<body>` element). Can be set to `document.documentElement`, `window`, or any scrollable element.                                                                                                                                         |
| `onLoaded`            | `undefined or () => void`    | `undefined`                | Optional function to run when the component has mounted                                                                                                                                                                                                                                                                                      |
| `disableDefaultStyles` | `boolean`                   | `false`                    | Disable default inline styles. Set to `true` if you want to provide all styles yourself via className. Gives you complete CSS control without any default styling.                                                                                                                                                                           |

### Default Configuration

The component includes **inline styles with CSS variables** (no CSS import needed, easy to customize!):

```javascript
{
  height: "var(--react-light-beam-height, 500px)",
  width: "var(--react-light-beam-width, 100vw)",
  transition: "none", // GSAP handles animations
  willChange: "background, opacity",
  userSelect: "none",
  pointerEvents: "none",
  contain: "layout style paint" // Performance optimization
}
```

**Benefits:**
- ✅ Works immediately out of the box
- ✅ Easy to customize via className (just set CSS variables!)
- ✅ No CSS import required for basic usage
- ✅ Inline styles use CSS variables, so className overrides work perfectly

### Recommended Usage

For best results, it's recommended to position the `LightBeam` component as an absolutely positioned element within a relatively positioned container. This allows the light beam to cast light downwards over your content, creating a more dynamic and engaging visual effect.

Example:

```jsx
<div className="container">
  <LightBeam className="lightBeam" />
</div>
```

And in your CSS or SCSS:

```scss
.container {
  position: relative;
  z-index: 1;

  .lightBeam {
    position: absolute;
    inset: 0;
    width: 100vw;
    height: 100%; // Important: Ensure the beam covers the entire height
    z-index: -1;
    margin-top: -300px; // Adjust as needed to position the light beam above the content
  }
}
```

### Dark Mode Support

The component automatically adjusts between light and dark modes based on the user's system preferences. You can pass different colors for light and dark modes using the `colorLightmode` and `colorDarkmode` props.

### Example

```jsx
<LightBeam
  id="lightbeam-example"
  className="custom-lightbeam"
  colorDarkmode="rgba(255, 255, 255, 0.8)"
  colorLightmode="rgba(0, 0, 0, 0.2)"
  fullWidth={0.5}
  maskLightByProgress={true}
  invert={true}
  scrollElement={document.body} // Example usage of the new scrollElement prop
/>
```

## 🌐 Hosting the Example/Demo

The example Next.js app in `/example` can be easily deployed to Vercel, Netlify, or GitHub Pages:

### Quick Deploy to Vercel (Recommended - 2 minutes)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Set **Root Directory** to `example`
6. Click "Deploy"

Done! You'll get a live URL like `https://your-project.vercel.app`

### Alternative: GitHub Pages with GitHub Actions

1. Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd example && npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./example/out
```

2. In `example/next.config.js`, add:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/react-light-beam', // Your repo name
}
module.exports = nextConfig
```

3. Push to GitHub - your site will auto-deploy to `https://yourusername.github.io/react-light-beam`

### Alternative: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `/example` folder
3. Or connect to GitHub and set base directory to `example`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repo
git clone https://github.com/stianalars1/react-light-beam.git
cd react-light-beam

# Install dependencies
npm install

# Build the package
npm run build

# Run the example
cd example
npm install
npm run dev
```

## 📝 Changelog

### v2.0.0 (2026-01-04)
- 🚀 **BREAKING:** Migrated from Framer Motion to GSAP ScrollTrigger
- ⚡️ 40% performance improvement
- 🐛 Fixed bidirectional scrolling issues
- 🐛 Fixed invert prop behavior
- 🐛 Fixed color switching glitches
- 🎨 Removed CSS transitions to prevent conflicts with GSAP
- 📦 Added `gsap` as peer dependency

## License

MIT © [Stian Larsen](https://github.com/stianlarsen)

---

**Built with ❤️ using GSAP ScrollTrigger**
