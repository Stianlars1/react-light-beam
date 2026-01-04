# @stianlarsen/react-light-beam

## 🚀 New Feature Alert!

We've added a new prop: `scrollElement`. This allows you to specify which element should have the scroll listener attached, giving you greater flexibility in using the LightBeam component!

[![npm version](https://badge.fury.io/js/%40stianlarsen%2Freact-light-beam.svg)](https://badge.fury.io/js/%40stianlarsen%2Freact-light-beam)

A customizable React component that creates a light beam effect using conic gradients. The component is fully responsive and supports both light and dark modes. Ideal for adding dynamic and engaging visual elements to your web applications.

## Preview

![LightBeam Component](https://github.com/Stianlars1/react-light-beam/blob/5422cdc60ae7ab6b52d644d452646bec7212f76f/lightBeam.png)

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

### Basic Usage (Recommended - No CSS Import Needed!)

The component works out of the box with inline styles:

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

export default App;
```

### Advanced Usage (Custom CSS)

If you want to use custom CSS instead of inline styles:

```jsx
import { LightBeam } from "@stianlarsen/react-light-beam";
import "@stianlarsen/react-light-beam/styles"; // Import base CSS

const App = () => {
  return (
    <LightBeam
      disableDefaultStyles={true} // Disable inline styles
      className="my-custom-lightbeam"
      colorDarkmode="rgba(255, 255, 255, 0.8)"
    />
  );
};
```

Then provide your own CSS:

```css
.my-custom-lightbeam {
  height: 800px; /* Custom height */
  width: 100%;
  /* Add your custom styles */
}
```

### Props

| Prop Name             | Type                         | Default Value              | Description                                                                                                                                                                                                                                                                                                                                  |
| --------------------- | ---------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | `string`                     | `undefined`                | Optional string representing a unique ID for the LightBeam container.                                                                                                                                                                                                                                                                        |
| `className`           | `string`                     | `undefined`                | Optional string representing custom classes to be added to the LightBeam container.                                                                                                                                                                                                                                                          |
| `colorLightmode`      | `string`                     | `rgba(0,0,0, 0.5)`         | Optional string representing the color of the light beam in light mode.                                                                                                                                                                                                                                                                      |
| `colorDarkmode`       | `string`                     | `rgba(255, 255, 255, 0.5)` | Optional string representing the color of the light beam in dark mode.                                                                                                                                                                                                                                                                       |
| `fullWidth`           | `number`                     | `1.0`                      | Optional number between `0` and `1` representing the maximum width the light beam can reach.                                                                                                                                                                                                                                                 |
| `maskLightByProgress` | `boolean`                    | `false`                    | If `true`, the `mask-image`'s linear gradient will start with the chosen color at 0% and the transparent part starting at 50%. As the user scrolls, it will dynamically change to have the transparent part at 95%, reducing the glow effect. If `false`, it will default to `linear-gradient(to bottom, chosenColor 25%, transparent 95%)`. |
| `invert`              | `boolean`                    | `false`                    | Optional boolean to invert the scroll progress calculation.                                                                                                                                                                                                                                                                                  |
| `scrollElement`       | `EventTarget` or `undefined` | `window`                   | Optional prop for which element to attach the scroll listener to. This could be the `window`, `document.body`, or any other scrollable element.                                                                                                                                                                                              |
| `onLoaded`            | `undefined or () => void`    | `undefined`                | Optional function to run when the component has mounted                                                                                                                                                                                                                                                                                      |
| `disableDefaultStyles` | `boolean`                   | `false`                    | Disable default inline styles. Set to `true` if you want to provide your own custom CSS. When enabled, you must import the styles separately: `import "@stianlarsen/react-light-beam/styles"`                                                                                                                                               |

### Default Configuration

The component includes **inline styles by default** (no CSS import needed!):

```javascript
{
  height: "500px",
  width: "100vw",
  transition: "all 0.25s ease",
  willChange: "all",
  userSelect: "none",
  pointerEvents: "none"
}
```

These inline styles ensure the component works immediately out of the box. If you prefer to use custom CSS, set `disableDefaultStyles={true}` and import the base CSS file.

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
