import { ElementRef } from '@angular/core';

export const INDICATOR_Y_OFFSET = 6;
export const INDICATOR_X_OFFSET = 2;

export interface IndicatorPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export interface PagePositionIndicatorConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  associatedElement?: ElementRef;
  position?: IndicatorPosition;
}

export const DEFAULT_CONFIG: PagePositionIndicatorConfig = {
  hasBackdrop: false,
};
