import { RectangularReshapersConfig } from '../../types/rectangular-reshapers-config';
import { CircleEReshaper } from './reshapers/circle-e-reshaper';
import { CircleNReshaper } from './reshapers/circle-n-reshaper';
import { CircleNeReshaper } from './reshapers/circle-ne-reshaper';
import { CircleNwReshaper } from './reshapers/circle-nw-reshaper';
import { CircleSReshaper } from './reshapers/circle-s-reshaper';
import { CircleSeReshaper } from './reshapers/circle-se-reshaper';
import { CircleSwReshaper } from './reshapers/circle-sw-reshaper';
import { CircleWReshaper } from './reshapers/circle-w-reshaper';

export const circleReshapersConfig: RectangularReshapersConfig = {
  nwReshaper: new CircleNwReshaper(),
  nReshaper: new CircleNReshaper(),
  neReshaper: new CircleNeReshaper(),
  eReshaper: new CircleEReshaper(),
  seReshaper: new CircleSeReshaper(),
  sReshaper: new CircleSReshaper(),
  swReshaper: new CircleSwReshaper(),
  wReshaper: new CircleWReshaper(),
};
