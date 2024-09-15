import { RectangularReshapersConfig } from '../../../../types/rectangular-reshapers-config';
import { RectangleEReshaper } from './reshapers/rectangle-e-reshaper';
import { RectangleNReshaper } from './reshapers/rectangle-n-reshaper';
import { RectangleNeReshaper } from './reshapers/rectangle-ne-reshaper';
import { RectangleNwReshaper } from './reshapers/rectangle-nw-reshaper';
import { RectangleSReshaper } from './reshapers/rectangle-s-reshaper';
import { RectangleSeReshaper } from './reshapers/rectangle-se-reshaper';
import { RectangleSwReshaper } from './reshapers/rectangle-sw-reshaper';
import { RectangleWReshaper } from './reshapers/rectangle-w-reshaper';

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
