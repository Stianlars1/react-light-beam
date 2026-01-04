import * as react_jsx_runtime from 'react/jsx-runtime';

type LightBeamProps = {
  className?: string;
  /**
   * Custom styles to merge with or override default styles.
   * User styles take priority over defaults.
   * @example style={{ height: '800px', width: '80vw' }}
   */
  style?: React.CSSProperties;
  fullWidth?: number;
  colorLightmode?: string;
  colorDarkmode?: string;
  maskLightByProgress?: boolean;
  invert?: boolean;
  id?: string;
  scrollElement?: EventTarget;
  onLoaded?: () => void;
  /**
   * Disable default inline styles. Set to true if you want to provide custom CSS via className only.
   * @default false
   */
  disableDefaultStyles?: boolean;
};

declare const LightBeam: ({ className, style, colorLightmode, colorDarkmode, maskLightByProgress, fullWidth, invert, id, onLoaded, scrollElement, disableDefaultStyles, }: LightBeamProps) => react_jsx_runtime.JSX.Element;

export { LightBeam };
