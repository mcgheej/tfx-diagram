import { TextBoxProps } from './text-box.types';

export type FontStyles = 'normal' | 'italic' | 'oblique';
export type FontVariants = 'normal' | 'small-caps';
export type FontWeights = 'normal' | 'bold' | 'bolder' | 'lighter';

export type FontProps = Pick<
  TextBoxProps,
  | 'mmPadding'
  | 'alignment'
  | 'fontFamily'
  | 'fontSizePt'
  | 'fontStyle'
  | 'fontVariant'
  | 'fontWeight'
  | 'underline'
  | 'color'
  | 'wordwrap'
>;
