import { Store } from '@ngrx/store';
import { ColorRef, ColorTheme } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';

export type ColorDialogTypes = 'Fill Color' | 'Line Color' | 'Text Color';

export interface ColorDialogData {
  dialogType: ColorDialogTypes;
  selectedColors: { lineColor?: ColorRef; fillColor?: ColorRef; textColor?: ColorRef };
  store: Store;
}

export interface ColorSquare {
  ref: ColorRef;
  color: Color;
}

export type ColorRow = ColorSquare[];

export const themeRow = (i: number, colorTheme: ColorTheme): ColorRow => {
  return [
    themeSquareFromColor(`background1-${i}`, colorTheme.background1[i]),
    themeSquareFromColor(`text1-${i}`, colorTheme.text1[i]),
    themeSquareFromColor(`background2-${i}`, colorTheme.background2[i]),
    themeSquareFromColor(`text2-${i}`, colorTheme.text2[i]),
    themeSquareFromColor(`accent1-${i}`, colorTheme.accent1[i]),
    themeSquareFromColor(`accent2-${i}`, colorTheme.accent2[i]),
    themeSquareFromColor(`accent3-${i}`, colorTheme.accent3[i]),
    themeSquareFromColor(`accent4-${i}`, colorTheme.accent4[i]),
    themeSquareFromColor(`accent5-${i}`, colorTheme.accent5[i]),
    themeSquareFromColor(`accent6-${i}`, colorTheme.accent6[i]),
  ];
};

export const themeSquareFromColor = (ref: string, color: Color): ColorSquare => {
  return {
    ref: { colorSet: 'theme', ref },
    color,
  };
};

export const standardSquareFromColor = (index: number, color: Color): ColorSquare => {
  return {
    ref: { colorSet: 'standard', ref: index.toString() },
    color,
  };
};

export const customSquareFromColor = (id: string, color: Color): ColorSquare => {
  return {
    ref: { colorSet: 'custom', ref: id },
    color,
  };
};
