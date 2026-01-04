export type LightBeamProps = {
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
