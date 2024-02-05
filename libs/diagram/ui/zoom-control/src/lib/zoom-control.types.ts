export type ZoomSelectType = 'fit-to-window' | 'fit-to-width' | number;
export interface ZoomControlConfig {
  presetZoomFactors: number[];
  initialZoomFactor: number;
}
