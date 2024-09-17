import { EndpointStyle } from './endpoint.types';

export const mmBaseLineWidth = 0.25;

// Arrow head ratios
export const arrowRatio = {
  height: 5,
  length: 16,
};

// Arrow head lengths for supported sizes
export const mmArrowLengths = {
  medium: 3,
  large: 5,
};

// Circle radii for supported sizes
export const mmRadii = {
  small: 0.75,
  medium: 1,
  large: 1.5,
};

// Array of supported styles
export const ENDPOINT_STYLES: EndpointStyle[] = [
  'none',
  'standard-arrow',
  'hollow-arrow',
  'solid-circle',
  'hollow-circle',
  'solid-diamond',
  'hollow-diamond',
  'half-circle',
];
