// Types
export type EndpointStyle =
  | 'none'
  | 'standard-arrow'
  | 'hollow-arrow'
  | 'solid-circle'
  | 'hollow-circle'
  | 'solid-diamond'
  | 'hollow-diamond'
  | 'half-circle';
export type EndpointSize = 'small' | 'medium' | 'large';

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
