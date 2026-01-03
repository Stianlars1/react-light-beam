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
};

declare const LightBeam: ({ className, colorLightmode, colorDarkmode, maskLightByProgress, fullWidth, invert, id, onLoaded, scrollElement, }: LightBeamProps) => react_jsx_runtime.JSX.Element;

export { LightBeam };
