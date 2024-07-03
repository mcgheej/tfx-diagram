import { Reshaper } from '@tfx-diagram/diagram-data-access-shape-base-class';

export interface RectangularReshapersConfig {
  nwReshaper: Reshaper;
  nReshaper: Reshaper;
  neReshaper: Reshaper;
  eReshaper: Reshaper;
  seReshaper: Reshaper;
  sReshaper: Reshaper;
  swReshaper: Reshaper;
  wReshaper: Reshaper;
}
