import * as react_jsx_runtime from 'react/jsx-runtime';

type DustParticlesConfig = {
  /**
   * Enable floating dust particles in the beam
   * @default false
   */
  enabled?: boolean;
  /**
   * Number of dust particles
   * @default 30
   */
  count?: number;
  /**
   * Animation speed multiplier (1 = normal, 2 = twice as fast)
   * @default 1
   */
  speed?: number;
  /**
   * Particle size range [min, max] in pixels
   * @default [1, 3]
   */
  sizeRange?: [number, number];
  /**
   * Particle opacity range [min, max]
   * @default [0.2, 0.6]
   */
  opacityRange?: [number, number];
  /**
   * Particle color (inherits beam color if not specified)
   */
  color?: string;
};

type MistConfig = {
  /**
   * Enable mist/fog effect
   * @default false
   */
  enabled?: boolean;
  /**
   * Mist intensity (0-1)
   * @default 0.3
   */
  intensity?: number;
  /**
   * Animation speed multiplier
   * @default 1
   */
  speed?: number;
  /**
   * Number of layered mist effects for depth
   * @default 2
   */
  layers?: number;
};

type PulseConfig = {
  /**
   * Enable rhythmic pulse effect
   * @default false
   */
  enabled?: boolean;
  /**
   * Pulse duration in seconds
   * @default 2
   */
  duration?: number;
  /**
   * Pulse intensity (0-1) - how much brightness varies
   * @default 0.2
   */
  intensity?: number;
  /**
   * GSAP easing function
   * @default "sine.inOut"
   */
  easing?: string;
};

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

  /**
   * Dust particles configuration
   * @example dustParticles={{ enabled: true, count: 50, speed: 1.5 }}
   */
  dustParticles?: DustParticlesConfig;

  /**
   * Mist/fog effect configuration
   * @example mist={{ enabled: true, intensity: 0.5, layers: 3 }}
   */
  mist?: MistConfig;

  /**
   * Pulse effect configuration
   * @example pulse={{ enabled: true, duration: 3, intensity: 0.3 }}
   */
  pulse?: PulseConfig;
};

declare const LightBeam: ({ className, style, colorLightmode, colorDarkmode, maskLightByProgress, fullWidth, invert, id, onLoaded, scrollElement, disableDefaultStyles, dustParticles, mist, pulse, }: LightBeamProps) => react_jsx_runtime.JSX.Element;

export { LightBeam };
