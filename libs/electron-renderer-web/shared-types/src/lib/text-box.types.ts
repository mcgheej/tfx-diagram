/**
 * id:          Same id as the parent shape. Also used by the associated TextBlock.
 * lineHeight:  Defines the height of a text line as a multiplier of the current
 *              font size.
 * mmPadding:   Top, right, bottom and left padding values in millimetres. The
 *              padding property specifies the distance between the text content
 *              and the boundaries of the TextBlock rectangle.
 * alignment:   Verical and horizontal alignment of the text block in the text
 *              box.
 * text:        Text string to display.
 * fontFamily:  name of the font family to use.
 * fontSizePt:  Size of the font in points (1pt = 1/72 inches).
 * color:       Color ref that resolves to the colour used to display the text.
 * wordwrap:    If true then text is wrapped to try and fit it within the text
 *              box.
 */

import { ColorRef } from './color-types';
import { Alignment, Padding } from './diagram.types';
import { FontStyles, FontVariants, FontWeights } from './font-types';

export interface TextBoxProps {
  id: string;
  lineHeight: number;
  mmPadding: Padding;
  alignment: Alignment;
  text: string;
  fontFamily: string;
  fontSizePt: number;
  fontStyle: FontStyles;
  fontVariant: FontVariants;
  fontWeight: FontWeights;
  underline: boolean;
  color: ColorRef;
  wordwrap: boolean;
}

export type TextBoxConfig = Partial<TextBoxProps>;
