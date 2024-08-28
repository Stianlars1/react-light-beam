# @stianlarsen/react-light-beam

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

```jsx
import { LightBeam } from "@stianlarsen/react-light-beam";
import "your-css-file.css"; // Include the necessary styles

const App = () => {
  return (
    <div className="your-container-class">
      <LightBeam
        id="unique-lightbeam"
        className="your-lightbeam-class"
        colorDarkmode="rgba(255, 255, 255, 0.8)"
        colorLightmode="rgba(0, 0, 0, 0.2)"
        fullWidth={0.8}
        maskLightByProgress={true}
        invert={false}
      />
      <YourContentHere />
    </div>
  );
};

export default App;
```

### Props

| Prop Name             | Type      | Default Value              | Description                                                                                                                                                                                                                                                                                                                                  |
| --------------------- | --------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | `string`  | `undefined`                | Optional string representing a unique ID for the LightBeam container.                                                                                                                                                                                                                                                                        |
| `className`           | `string`  | `undefined`                | Optional string representing custom classes to be added to the LightBeam container.                                                                                                                                                                                                                                                          |
| `colorLightmode`      | `string`  | `rgba(0,0,0, 0.5)`         | Optional string representing the color of the light beam in light mode.                                                                                                                                                                                                                                                                      |
| `colorDarkmode`       | `string`  | `rgba(255, 255, 255, 0.5)` | Optional string representing the color of the light beam in dark mode.                                                                                                                                                                                                                                                                       |
| `fullWidth`           | `number`  | `1.0`                      | Optional number between `0` and `1` representing the maximum width the light beam can reach.                                                                                                                                                                                                                                                 |
| `maskLightByProgress` | `boolean` | `false`                    | If `true`, the `mask-image`'s linear gradient will start with the chosen color at 0% and the transparent part starting at 50%. As the user scrolls, it will dynamically change to have the transparent part at 95%, reducing the glow effect. If `false`, it will default to `linear-gradient(to bottom, chosenColor 25%, transparent 95%)`. |
| `invert`              | `boolean` | `false`                    | Optional boolean to invert the scroll progress calculation.                                                                                                                                                                                                                                                                                  |

### Default Configuration

The component comes with the following default styles:

```css
.react__light__beam {
  height: 500px;
  width: 100vw;
  transition: all 0.5s ease;
  will-change: auto;
}
```

These default styles ensure that the component is immediately visible when added to your application. However, for more effective use, you might want to customize its position and behavior.

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
/>
```

### License

MIT © [Stian Larsen](https://github.com/stianlarsen)
