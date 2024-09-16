import { RectangularReshapersConfig } from '../../types/rectangular-reshapers-config';
import { CircleEReshaper } from './circle-e-reshaper';
import { CircleNReshaper } from './circle-n-reshaper';
import { CircleNeReshaper } from './circle-ne-reshaper';
import { CircleNwReshaper } from './circle-nw-reshaper';
import { CircleSReshaper } from './circle-s-reshaper';
import { CircleSeReshaper } from './circle-se-reshaper';
import { CircleSwReshaper } from './circle-sw-reshaper';
import { CircleWReshaper } from './circle-w-reshaper';

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
