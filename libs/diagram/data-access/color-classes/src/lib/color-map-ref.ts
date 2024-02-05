import { ColorsState } from '@tfx-diagram/electron-renderer-web/ngrx-state-colors';
import { ColorRef } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';

export class ColorMapRef {
  static colorsState: ColorsState;

  static resolveColor(ref: ColorRef): Color | undefined {
    if (ref && ref.colorSet && ref.ref) {
      if (this.colorsState) {
        switch (ref.colorSet) {
          case 'theme': {
            const [role, tint] = ref.ref.split('-');
            return themeColor(role, tint, this.colorsState);
          }
          case 'standard': {
            if (ref.ref.match(/^\d$/)) {
              return this.colorsState.standardColors[+ref.ref];
            }
            return undefined;
          }
          case 'custom': {
            return this.colorsState.customColors[ref.ref];
          }
          case 'empty': {
            return undefined;
          }
        }
      }
    }
    return undefined;
  }

  static resolve(ref: ColorRef): string {
    if (ref.colorSet === 'rgb') {
      return ref.ref;
    }

    const color = ColorMapRef.resolveColor(ref);
    if (color) {
      return color.rgb.hex;
    }
    return '';
  }
}

const themeColor = (
  role: string,
  tintIndex: string,
  colorsState: ColorsState
): Color | undefined => {
  if (tintIndex.match(/^[012345]$/)) {
    switch (role) {
      case 'background1': {
        return colorsState.themeColors.background1[+tintIndex];
      }
      case 'text1': {
        return colorsState.themeColors.text1[+tintIndex];
      }
      case 'background2': {
        return colorsState.themeColors.background2[+tintIndex];
      }
      case 'text2': {
        return colorsState.themeColors.text2[+tintIndex];
      }
      case 'accent1': {
        return colorsState.themeColors.accent1[+tintIndex];
      }
      case 'accent2': {
        return colorsState.themeColors.accent2[+tintIndex];
      }
      case 'accent3': {
        return colorsState.themeColors.accent3[+tintIndex];
      }
      case 'accent4': {
        return colorsState.themeColors.accent4[+tintIndex];
      }
      case 'accent5': {
        return colorsState.themeColors.accent5[+tintIndex];
      }
      case 'accent6': {
        return colorsState.themeColors.accent6[+tintIndex];
      }
    }
  }
  return undefined;
};
