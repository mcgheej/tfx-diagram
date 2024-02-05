export interface HighlightColours {
  colour: string;
  backgroundColour: string;
}

export type ButtonTypes = 'circle' | 'rectangle' | 'icon';
export type HighlightBehaviour = 'darken' | 'lighten' | HighlightColours;

export interface IconButtonOptions {
  id: string;
  iconName: string;
  disabled: boolean;
  buttonType: ButtonTypes;
  highlightDisabled: boolean;
  highlightBehaviour: HighlightBehaviour;
  rotation: '0deg' | '90deg' | '180deg' | '270deg';
  fontSizePx: number;
  cursorType: 'default' | 'pointer';
}

export type IconButtonConfig = Partial<IconButtonOptions>;
