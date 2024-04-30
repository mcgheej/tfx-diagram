import { getHexByte } from '@tfx-diagram/diagram/util/misc-functions';
import { ColorTheme } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Color, rgb2hsl } from '@tfx-diagram/shared-angular/utils/shared-types';

const defaultRGBs = [
  {
    description: 'White',
    color: [255, 255, 255],
    tints: [
      {
        description: 'White, Darker 5%',
        color: [242, 242, 242],
      },
      {
        description: 'White, Darker 15%',
        color: [217, 217, 217],
      },
      {
        description: 'White, Darker 25%',
        color: [191, 191, 191],
      },
      {
        description: 'White, Darker 35%',
        color: [166, 166, 166],
      },
      {
        description: 'White, Darker 50%',
        color: [128, 128, 128],
      },
    ],
  },
  {
    description: 'Black',
    color: [0, 0, 0],
    tints: [
      {
        description: 'Black, Lighter 50%',
        color: [128, 128, 128],
      },
      {
        description: 'Black, Lighter 35%',
        color: [89, 89, 89],
      },
      {
        description: 'Black, Lighter 25%',
        color: [64, 64, 64],
      },
      {
        description: 'Black, Lighter 15%',
        color: [38, 38, 38],
      },
      {
        description: 'Black, Lighter 5%',
        color: [13, 13, 13],
      },
    ],
  },
  {
    description: 'Light Gray',
    color: [231, 230, 230],
    tints: [
      {
        description: 'Light Gray, Darker 10%',
        color: [208, 206, 206],
      },
      {
        description: 'Light Gray, Darker 25%',
        color: [174, 170, 170],
      },
      {
        description: 'Light Gray, Darker 50%',
        color: [117, 113, 113],
      },
      {
        description: 'Light Gray, Darker 75%',
        color: [58, 56, 56],
      },
      {
        description: 'Light Gray, Darker 90%',
        color: [22, 22, 22],
      },
    ],
  },
  {
    description: 'Blue-Gray',
    color: [68, 84, 106],
    tints: [
      {
        description: 'Blue-Gray, Lighter 80%',
        color: [214, 220, 228],
      },
      {
        description: 'Blue-Gray, Lighter 60%',
        color: [172, 185, 202],
      },
      {
        description: 'Blue-Gray, Lighter 40%',
        color: [132, 151, 176],
      },
      {
        description: 'Blue-Gray, Darker 25%',
        color: [51, 63, 79],
      },
      {
        description: 'Blue-Gray, Darker 50%',
        color: [34, 43, 53],
      },
    ],
  },
  {
    description: 'Blue',
    color: [68, 114, 196],
    tints: [
      {
        description: 'Blue, Lighter 80%',
        color: [217, 225, 242],
      },
      {
        description: 'Blue, Lighter 60%',
        color: [180, 198, 231],
      },
      {
        description: 'Blue, Lighter 40%',
        color: [142, 169, 219],
      },
      {
        description: 'Blue, Darker 25%',
        color: [48, 84, 150],
      },
      {
        description: 'Blue, Darker 50%',
        color: [32, 55, 100],
      },
    ],
  },
  {
    description: 'Orange',
    color: [237, 125, 49],
    tints: [
      {
        description: 'Orange, Lighter 80%',
        color: [252, 228, 214],
      },
      {
        description: 'Orange, Lighter 60%',
        color: [248, 203, 173],
      },
      {
        description: 'Orange, Lighter 40%',
        color: [244, 176, 132],
      },
      {
        description: 'Orange, Darker 25%',
        color: [198, 89, 17],
      },
      {
        description: 'Orange, Darker 50%',
        color: [131, 60, 12],
      },
    ],
  },
  {
    description: 'Gray',
    color: [165, 165, 165],
    tints: [
      {
        description: 'Gray, Lighter 80%',
        color: [237, 237, 237],
      },
      {
        description: 'Gray, Lighter 60%',
        color: [219, 219, 219],
      },
      {
        description: 'Gray, Lighter 40%',
        color: [201, 201, 201],
      },
      {
        description: 'Gray, Darker 25%',
        color: [123, 123, 123],
      },
      {
        description: 'Gray, Darker 50%',
        color: [82, 82, 82],
      },
    ],
  },
  {
    description: 'Gold',
    color: [255, 192, 0],
    tints: [
      {
        description: 'Gold, Lighter 80%',
        color: [255, 242, 204],
      },
      {
        description: 'Gold, Lighter 60%',
        color: [255, 230, 153],
      },
      {
        description: 'Gold, Lighter 40%',
        color: [255, 217, 102],
      },
      {
        description: 'Gold, Darker 25%',
        color: [192, 143, 0],
      },
      {
        description: 'Gold, Darker 50%',
        color: [128, 96, 0],
      },
    ],
  },
  {
    description: 'Blue',
    color: [91, 155, 213],
    tints: [
      {
        description: 'Blue, Lighter 80%',
        color: [221, 235, 247],
      },
      {
        description: 'Blue, Lighter 60%',
        color: [189, 215, 238],
      },
      {
        description: 'Blue, Lighter 40%',
        color: [155, 194, 230],
      },
      {
        description: 'Blue, Darker 25%',
        color: [47, 117, 181],
      },
      {
        description: 'Blue, Darker 50%',
        color: [31, 78, 120],
      },
    ],
  },
  {
    description: 'Green',
    color: [112, 173, 71],
    tints: [
      {
        description: 'Green, Lighter 80%',
        color: [226, 239, 218],
      },
      {
        description: 'Green, Lighter 60%',
        color: [198, 224, 180],
      },
      {
        description: 'Green, Lighter 40%',
        color: [169, 208, 142],
      },
      {
        description: 'Green, Darker 25%',
        color: [84, 130, 53],
      },
      {
        description: 'Green, Darker 50%',
        color: [55, 86, 35],
      },
    ],
  },
];

export const defaultTheme = (): ColorTheme => {
  return {
    name: 'Default Theme',
    background1: getRoleColors(0),
    text1: getRoleColors(1),
    background2: getRoleColors(2),
    text2: getRoleColors(3),
    accent1: getRoleColors(4),
    accent2: getRoleColors(5),
    accent3: getRoleColors(6),
    accent4: getRoleColors(7),
    accent5: getRoleColors(8),
    accent6: getRoleColors(9),
  } as ColorTheme;
};

const getRoleColors = (i: number): Color[] => {
  if (defaultRGBs[i] && defaultRGBs[i].tints) {
    const { description, color, tints } = defaultRGBs[i];
    const roleColors: Color[] = [getColor(description, color)];
    for (let j = 0; j < tints.length; j++) {
      roleColors.push(getColor(tints[j].description, tints[j].color));
    }
    return roleColors;
  }
  return [];
};

const getColor = (description: string, rgb: number[]): Color => {
  return {
    description,
    hsl: rgb2hsl(rgb[0], rgb[1], rgb[2]),
    rgb: {
      red: rgb[0],
      green: rgb[1],
      blue: rgb[2],
      hex: '#' + getHexByte(rgb[0]) + getHexByte(rgb[1]) + getHexByte(rgb[2]),
    },
  };
};
