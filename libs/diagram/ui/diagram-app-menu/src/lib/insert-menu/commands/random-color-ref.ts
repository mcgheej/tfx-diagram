import { randomNumber } from '@tfx-diagram/diagram/util/misc-functions';
import { ColorRef } from '@tfx-diagram/electron-renderer-web/shared-types';

export const randomColorRef = (): ColorRef => {
  const set = Math.floor(Math.random() * 2);
  if (set === 0) {
    // theme colour set
    const roleI = randomNumber(0, 9);
    const tint = randomNumber(0, 5);
    return { colorSet: 'theme', ref: `${roles[roleI]}-${tint}` };
  } else {
    // standard color set
    const i = randomNumber(0, 9);
    return { colorSet: 'standard', ref: i.toString() };
  }
};

const roles = [
  'background1',
  'text1',
  'background2',
  'text2',
  'accent1',
  'accent2',
  'accent3',
  'accent4',
  'accent5',
  'accent6',
];
