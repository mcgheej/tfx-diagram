import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';

export interface ColorTheme {
  name: string;
  background1: Color[];
  text1: Color[];
  background2: Color[];
  text2: Color[];
  accent1: Color[];
  accent2: Color[];
  accent3: Color[];
  accent4: Color[];
  accent5: Color[];
  accent6: Color[];
}

export interface ColorRef {
  colorSet: 'theme' | 'standard' | 'custom' | 'empty' | 'rgb';
  ref: string;
}
