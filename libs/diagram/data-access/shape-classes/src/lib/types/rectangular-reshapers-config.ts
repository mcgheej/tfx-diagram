import { Reshaper } from '../reshapers';

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
