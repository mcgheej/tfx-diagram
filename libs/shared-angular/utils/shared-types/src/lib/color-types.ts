export interface ColorHSL {
  hue: number;
  saturation: number;
  lightness: number;
}

export interface ColorRGB {
  red: number;
  green: number;
  blue: number;
  hex: string;
}

export interface Color {
  description: string;
  hsl: ColorHSL;
  rgb: ColorRGB;
}
