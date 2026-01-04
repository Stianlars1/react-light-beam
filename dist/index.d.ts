import * as react_jsx_runtime from 'react/jsx-runtime';

type LightBeamProps = {
  className?: string;
  fullWidth?: number;
  colorLightmode?: string;
  colorDarkmode?: string;
  maskLightByProgress?: boolean;
  invert?: boolean;
  id?: string;
  scrollElement?: EventTarget;
  onLoaded?: () => void;
  /**
   * Disable default inline styles. Set to true if you want to provide custom CSS.
   * @default false
   */
  disableDefaultStyles?: boolean;
};

declare const LightBeam: ({ className, colorLightmode, colorDarkmode, maskLightByProgress, fullWidth, invert, id, onLoaded, scrollElement, disableDefaultStyles, }: LightBeamProps) => react_jsx_runtime.JSX.Element;

export { LightBeam };
