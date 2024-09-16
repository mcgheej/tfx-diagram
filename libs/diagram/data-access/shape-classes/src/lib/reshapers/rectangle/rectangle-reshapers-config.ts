import { RectangularReshapersConfig } from '../../types/rectangular-reshapers-config';
import { RectangleEReshaper } from './rectangle-e-reshaper';
import { RectangleNReshaper } from './rectangle-n-reshaper';
import { RectangleNeReshaper } from './rectangle-ne-reshaper';
import { RectangleNwReshaper } from './rectangle-nw-reshaper';
import { RectangleSReshaper } from './rectangle-s-reshaper';
import { RectangleSeReshaper } from './rectangle-se-reshaper';
import { RectangleSwReshaper } from './rectangle-sw-reshaper';
import { RectangleWReshaper } from './rectangle-w-reshaper';

export const rectangleReshapersConfig: RectangularReshapersConfig = {
  nwReshaper: new RectangleNwReshaper(),
  nReshaper: new RectangleNReshaper(),
  neReshaper: new RectangleNeReshaper(),
  eReshaper: new RectangleEReshaper(),
  seReshaper: new RectangleSeReshaper(),
  sReshaper: new RectangleSReshaper(),
  swReshaper: new RectangleSwReshaper(),
  wReshaper: new RectangleWReshaper(),
};
