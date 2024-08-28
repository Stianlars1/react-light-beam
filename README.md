# @stianlarsen/react-light-beam

[![npm version](https://badge.fury.io/js/%40stianlarsen%2Freact-light-beam.svg)](https://badge.fury.io/js/%40stianlarsen%2Freact-light-beam)

A customizable React component that creates a light beam effect using conic gradients. The component is fully responsive and supports both light and dark modes. Ideal for adding dynamic and engaging visual elements to your web applications.

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
        className="your-lightbeam-class"
        colorDarkmode="hsl(var(--primary) / 1)"
        colorLightmode="hsl(var(--foreground) / 0.2)"
        fullWidth={0.8}
      />
      <YourContentHere />
    </div>
  );
};

export default App;
```

### Props

| Prop Name        | Type     | Default Value              | Description                                                                                  |
| ---------------- | -------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| `className`      | `string` | `undefined`                | Optional string representing custom classes to be added to the LightBeam container.          |
| `colorLightmode` | `string` | `rgba(0,0,0, 0.5)`         | Optional string representing the color of the light beam in light mode.                      |
| `colorDarkmode`  | `string` | `rgba(255, 255, 255, 0.5)` | Optional string representing the color of the light beam in dark mode.                       |
| `fullWidth`      | `number` | `1.0`                      | Optional number between `0` and `1` representing the maximum width the light beam can reach. |

### Customization

You can customize the appearance and behavior of the light beam by adjusting the props or by applying additional styles via the `className` prop.

### Dark Mode Support

The component automatically adjusts between light and dark modes based on the user's system preferences. You can pass different colors for light and dark modes using the `colorLightmode` and `colorDarkmode` props.

### Example

```jsx
<LightBeam
  className="custom-lightbeam"
  colorDarkmode="hsl(210, 22%, 18%)"
  colorLightmode="hsl(0, 0%, 98%)"
  fullWidth={0.5}
/>
```

### License

MIT © [Stian Larsen](https://github.com/stianlarsen)
