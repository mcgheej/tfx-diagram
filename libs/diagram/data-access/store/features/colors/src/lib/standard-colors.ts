import { getHexByte } from '@tfx-diagram/diagram/util/misc-functions';
import { rgb2hsl } from '@tfx-diagram/shared-angular/ui/tfx-color-picker';
import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';

export const standardColors = (): Color[] => {
  const colors: Color[] = [];
  colors.push(colorFromRGB('Dark Red', 192, 0, 0));
  colors.push(colorFromRGB('Red', 255, 0, 0));
  colors.push(colorFromRGB('Orange', 255, 192, 0));
  colors.push(colorFromRGB('Yellow', 255, 255, 0));
  colors.push(colorFromRGB('Light Green', 146, 208, 80));
  colors.push(colorFromRGB('Green', 0, 176, 80));
  colors.push(colorFromRGB('Light Blue', 0, 176, 240));
  colors.push(colorFromRGB('Blue', 0, 112, 192));
  colors.push(colorFromRGB('Dark Blue', 0, 32, 96));
  colors.push(colorFromRGB('Purple', 112, 48, 160));
  return colors;
};

const colorFromRGB = (description: string, r: number, g: number, b: number): Color => {
  return {
    description,
    hsl: rgb2hsl(r, g, b),
    rgb: {
      red: r,
      green: g,
      blue: b,
      hex: '#' + getHexByte(r) + getHexByte(g) + getHexByte(b),
    },
  };
};
