import { ColorTheme } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';

export const colorsKey = 'colors';

export interface ColorsState {
  themeColors: ColorTheme;
  standardColors: Color[];
  customColors: { [id: string]: Color };
  customColorIds: string[];
}
