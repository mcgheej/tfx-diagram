import {
  Alignment,
  ColorRef,
  FontStyles,
  FontVariants,
  FontWeights,
  Padding,
  PartPartial,
  TextBoxConfig,
  TextBoxProps,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { TextBlock } from './text-block';
import { DrawingParams } from './text-box.types';

const textBoxDefaults: TextBoxProps = {
  id: '',
  lineHeight: 1,
  mmPadding: { top: 0, right: 0, bottom: 0, left: 0 },
  alignment: { horizontal: 'center', vertical: 'center' },
  text: '',
  fontFamily: 'sans-serif',
  fontSizePt: 10,
  fontStyle: 'normal',
  fontVariant: 'normal',
  fontWeight: 'normal',
  underline: false,
  color: { colorSet: 'theme', ref: 'text1-3' },
  wordwrap: true,
};

export class TextBox implements TextBoxProps {
  static textBlockCache = new Map<string, TextBlock>();
  static flushTextBlockCache() {
    TextBox.textBlockCache = new Map<string, TextBlock>();
  }

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

  /**
   * Constructor for TextBox
   * @param {PartPartial<TextBoxConfig, 'id'>} config - configures the TextBox
   * @param {Rect} parentRect - the rectangle bounding the parent shape. Defines
   * the bounding rectangle for the TextBox
   */
  constructor(config: PartPartial<TextBoxConfig, 'id'>, parentRect: Rect) {
    // Initialise the properties of the TextBlock
    this.id = config.id;
    this.lineHeight = config.lineHeight ?? textBoxDefaults.lineHeight;
    this.mmPadding = config.mmPadding ?? textBoxDefaults.mmPadding;
    this.alignment = config.alignment ?? textBoxDefaults.alignment;
    this.text = config.text ?? textBoxDefaults.text;
    this.fontFamily = config.fontFamily ?? textBoxDefaults.fontFamily;
    this.fontSizePt = config.fontSizePt ?? textBoxDefaults.fontSizePt;
    this.fontStyle = config.fontStyle ?? textBoxDefaults.fontStyle;
    this.fontVariant = config.fontVariant ?? textBoxDefaults.fontVariant;
    this.fontWeight = config.fontWeight ?? textBoxDefaults.fontWeight;
    this.underline = config.underline ?? textBoxDefaults.underline;
    this.color = config.color ?? textBoxDefaults.color;
    this.wordwrap = config.wordwrap ?? textBoxDefaults.wordwrap;

    // If there is an associated cached TextBlock check if any actions required
    const textBlock = TextBox.textBlockCache.get(this.id);
    if (textBlock) {
      if (propertiesChanged(parentRect, textBlock, this)) {
        // One or more properties changed or size of parent rectangle changed
        // therefore need delete associated TextBlock from cache. When next draw
        // occurs new TextBlock will be associated with the TextBox.
        TextBox.textBlockCache.delete(this.id);
      } else if (
        parentRect.x !== textBlock.parentRect.x ||
        parentRect.y !== textBlock.parentRect.y
      ) {
        // If the parent shape has been moved then modify the associated
        // TextBlock as required
        if (textBlock.transform) {
          textBlock.move(parentRect.x, parentRect.y);
        } else {
          // Shouldn't really get here but if it does happen then delete
          // the associated TextBlock just in case.
          TextBox.textBlockCache.delete(this.id);
        }
      }
    }
  }

  /**
   *
   * @param c
   * @param t
   * @param r - parent shape rectangle
   * @returns
   */
  draw(c: CanvasRenderingContext2D, t: Transform, r: Rect): void {
    // if (this.text === '') {
    //   return;
    // }
    c.save();
    this.drawText(c, r, t);
    c.restore();
  }

  /**
   *
   * @param c
   * @param r - parent shape rectangle
   * @param t
   */
  private drawText(c: CanvasRenderingContext2D, r: Rect, t: Transform) {
    const d = this.getParams(r, t);
    const textBlock = this.getTextBlock(c, t, r, d);
    if (this.text === '') {
      return;
    }
    textBlock.draw(c, t);
  }

  /**
   *
   * @param c - canvas context
   * @param t - current transform
   * @param r - parent shape rectangle rectangle
   * @param d - transformed drawing parameters
   * @returns - usable TextBlock
   */
  private getTextBlock(
    c: CanvasRenderingContext2D,
    t: Transform,
    r: Rect,
    d: DrawingParams
  ): TextBlock {
    let cachedBlock = TextBox.textBlockCache.get(this.id);
    if (cachedBlock && cachedBlock.transform) {
      // Check if needs refresh then return
      if (t.scaleFactor !== cachedBlock.transform.scaleFactor) {
        // Needs full refresh
        cachedBlock = new TextBlock(this as TextBoxProps, r);
        cachedBlock.configure(c, t, this as TextBoxProps, d);
      } else if (
        t.transX !== cachedBlock.transform.transX ||
        t.transY !== cachedBlock.transform.transY
      ) {
        // Needs to be moved on canvas
        cachedBlock.translate(r.x, r.y, d, t);
      }

      TextBox.textBlockCache.set(this.id, cachedBlock);
      return cachedBlock;
    }
    cachedBlock = new TextBlock(this as TextBoxProps, r);
    cachedBlock.configure(c, t, this as TextBoxProps, d);
    TextBox.textBlockCache.set(this.id, cachedBlock);
    return cachedBlock;
  }

  /**
   *
   * @param r - TextBox rectangle
   * @param t - current transform
   * @returns - transformed drawing parameters
   */
  private getParams(r: Rect, t: Transform): DrawingParams {
    const fontSize = ((t.scaleFactor * this.fontSizePt) / 72) * 25.4;
    return {
      x: t.scaleFactor * (r.x + t.transX),
      y: t.scaleFactor * (r.y + t.transY),
      width: t.scaleFactor * r.width,
      height: t.scaleFactor * r.height,
      fontSize: fontSize < 2 ? 2 : fontSize,
      pxPadding: {
        top: t.scaleFactor * this.mmPadding.top,
        right: t.scaleFactor * this.mmPadding.right,
        bottom: t.scaleFactor * this.mmPadding.bottom,
        left: t.scaleFactor * this.mmPadding.left,
      },
    };
  }
}

const propertiesChanged = (
  parentRect: Rect,
  textBlock: TextBlock,
  textBox: TextBox
): boolean => {
  return (
    parentRect.width !== textBlock.parentRect.width ||
    parentRect.height !== textBlock.parentRect.height ||
    textBox.lineHeight !== textBlock.parentProps.lineHeight ||
    textBox.mmPadding.top !== textBlock.parentProps.mmPadding.top ||
    textBox.mmPadding.right !== textBlock.parentProps.mmPadding.right ||
    textBox.mmPadding.bottom !== textBlock.parentProps.mmPadding.bottom ||
    textBox.mmPadding.left !== textBlock.parentProps.mmPadding.left ||
    textBox.alignment.horizontal !== textBlock.parentProps.alignment.horizontal ||
    textBox.alignment.vertical !== textBlock.parentProps.alignment.vertical ||
    textBox.text !== textBlock.parentProps.text ||
    textBox.fontFamily !== textBlock.parentProps.fontFamily ||
    textBox.fontSizePt !== textBlock.parentProps.fontSizePt ||
    textBox.fontStyle !== textBlock.parentProps.fontStyle ||
    textBox.fontVariant !== textBlock.parentProps.fontVariant ||
    textBox.fontWeight !== textBlock.parentProps.fontWeight ||
    textBox.underline !== textBlock.parentProps.underline ||
    textBox.color !== textBlock.parentProps.color ||
    textBox.wordwrap !== textBlock.parentProps.wordwrap
  );
};
