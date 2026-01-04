# @stianlarsen/react-light-beam

## 🚀 New Feature Alert!

We've added a new prop: `scrollElement`. This allows you to specify which element should have the scroll listener attached, giving you greater flexibility in using the LightBeam component!

[![npm version](https://badge.fury.io/js/%40stianlarsen%2Freact-light-beam.svg)](https://badge.fury.io/js/%40stianlarsen%2Freact-light-beam)

A customizable React component that creates a light beam effect using conic gradients. The component is fully responsive and supports both light and dark modes. Ideal for adding dynamic and engaging visual elements to your web applications.

## Preview

![LightBeam Component](https://raw.githubusercontent.com/Stianlars1/react-light-beam/main/lightBeam.png)

_A preview of @stianlarsen/react-light-beam_

## Installation

```bash
npm install @stianlarsen/react-light-beam
```

or

```bash
yarn add @stianlarsen/react-light-beam
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
  --react-light-beam-transition: all 0.5s ease-in-out;
}
```

**Available CSS Variables:**
- `--react-light-beam-height` (default: `500px`)
- `--react-light-beam-width` (default: `100vw`)
- `--react-light-beam-transition` (default: `all 0.25s ease`)

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
  transition: "var(--react-light-beam-transition, all 0.25s ease)",
  willChange: "all",
  userSelect: "none",
  pointerEvents: "none"
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

### License

MIT © [Stian Larsen](https://github.com/stianlarsen)
