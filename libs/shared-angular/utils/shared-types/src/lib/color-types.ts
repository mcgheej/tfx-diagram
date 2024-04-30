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
export const rgb2hsl = (r: number, g: number, b: number): ColorHSL => {
  // Convert R, G, B components to range 0 - 1
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;

  // Find max and min values and calculate chroma (range) and the mid-range
  const MAX = Math.max(R, G, B);
  const MIN = Math.min(R, G, B);
  const C = MAX - MIN;
  const L = (MAX + MIN) / 2;

  // Now calculate the hue
  let hue = 0;
  if (C === 0) {
    hue = 0;
  } else {
    switch (MAX) {
      case R: {
        hue = 60 * (((G - B) / C) % 6);
        break;
      }
      case G: {
        hue = 60 * (2 + (B - R) / C);
        break;
      }
      case B: {
        hue = 60 * (4 + (R - G) / C);
        break;
      }
    }
  }
  if (hue < 0) {
    hue = 360 + hue;
  }

  // Finally calculate the saturation
  let S = 0;
  if (C === 0) {
    S = 0;
  } else {
    S = C / (1 - Math.abs(2 * L - 1));
  }
  return {
    hue,
    saturation: S,
    lightness: L,
  };
};

export const hsl2rgb = (h: number, s: number, l: number): ColorRGB => {
  // Calculate range
  const C = (1 - Math.abs(2 * l - 1)) * s;

  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));

  const m = l - C / 2;
  let rDash: ColorRGB = { red: 0, green: 0, blue: 0, hex: '' };
  if (h >= 0 && h < 60) {
    rDash = { red: C, green: X, blue: 0, hex: '' };
  } else if (h >= 60 && h < 120) {
    rDash = { red: X, green: C, blue: 0, hex: '' };
  } else if (h >= 120 && h < 180) {
    rDash = { red: 0, green: C, blue: X, hex: '' };
  } else if (h >= 180 && h < 240) {
    rDash = { red: 0, green: X, blue: C, hex: '' };
  } else if (h >= 240 && h < 300) {
    rDash = { red: X, green: 0, blue: C, hex: '' };
  } else if (h >= 300 && h < 360) {
    rDash = { red: C, green: 0, blue: X, hex: '' };
  }
  const rgb: ColorRGB = {
    red: (rDash.red + m) * 255,
    green: (rDash.green + m) * 255,
    blue: (rDash.blue + m) * 255,
    hex: '',
  };
  return {
    ...rgb,
    hex:
      '#' +
      getHexByte(Math.round(rgb.red)) +
      getHexByte(Math.round(rgb.green)) +
      getHexByte(Math.round(rgb.blue)),
  };
};

const getHexByte = (n: number): string => {
  const result = n.toString(16);
  if (result.length === 2) {
    return result;
  }
  if (result.length === 1) {
    return '0' + result;
  }
  return '00';
};
