/**
 * TextBlock Class
 * ===============
 * The TextBlock class manages how the text in a TextBox
 * object is displayed. The text in a TextBox is stored as
 * a single string but can contain newline characters (\r,
 * \r\n, or just \n) to delimit physical lines in the text
 * string.
 *
 */

import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import {
  HorizontalAlignment,
  Point,
  Range,
  TextBoxProps,
  Transform,
  VerticalAlignment,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { DrawingParams } from './text-box.types';

/**
 * DisplayWord
 * -----------
 * idxStart: index into DisplayLine text property for word start
 * idxEnd:   index into DisplayLine text property for char after word
 * xStart:   x coord in pixels for left edge of first char in word
 * xEnd:     x coord in pixels for right edge of last char in word (also
 *           for left edge of char after word - or end of string in
 *           text property)
 */
export interface DisplayWord {
  idxStart: number;
  idxEnd: number;
  xStart: number;
  xEnd: number;
}

/**
 * DisplayLine
 * -----------
 * x:      x coord in pixels of start of display line
 * y:      y coord in pixels of start of display line - assumes the textBaseline
 *         Canvas property is set to 'alphabetic'
 * width:  width of display line in pixels
 * height: height of display line in pixels
 * text:   string containing the text in the display line.
 * fontBoundingBoxAscent: taken from the text metrics Canvas method
 * xChars: contains x coord of left edge of each character in the text property
 * xWords: contains a DisplayWord object for each word in the text property
 */
export interface DisplayLine {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontBoundingBoxAscent: number;
  fontBoundingBoxDescent: number;
  xChars: number[];
  xWords: DisplayWord[];
  wrapped: boolean;
  startInsertPosition: number;
  endInsertPosition: number;
}

export class TextBlock {
  pxX = 0;
  pxY = 0;
  pxWidth = 0;
  pxHeight = 0;
  lines: DisplayLine[] = [];
  transform: Transform | null = null;

  parentProps: TextBoxProps;

  constructor(textBoxProps: TextBoxProps, public parentRect: Rect) {
    this.parentProps = {
      id: textBoxProps.id,
      lineHeight: textBoxProps.lineHeight,
      mmPadding: {
        top: textBoxProps.mmPadding.top,
        right: textBoxProps.mmPadding.right,
        bottom: textBoxProps.mmPadding.bottom,
        left: textBoxProps.mmPadding.left,
      },
      alignment: {
        horizontal: textBoxProps.alignment.horizontal,
        vertical: textBoxProps.alignment.vertical,
      },
      text: textBoxProps.text,
      fontFamily: textBoxProps.fontFamily,
      fontSizePt: textBoxProps.fontSizePt,
      fontStyle: textBoxProps.fontStyle,
      fontVariant: textBoxProps.fontVariant,
      fontWeight: textBoxProps.fontWeight,
      underline: textBoxProps.underline,
      color: textBoxProps.color,
      wordwrap: textBoxProps.wordwrap,
    };
  }

  move(newX: number, newY: number): void {
    if (this.transform) {
      const t = this.transform;
      const shiftX =
        t.scaleFactor * (newX + t.transX) - t.scaleFactor * (this.parentRect.x + t.transX);
      const shiftY =
        t.scaleFactor * (newY + t.transY) - t.scaleFactor * (this.parentRect.y + t.transY);
      this.lines = this.shift(shiftX, shiftY, this.lines);
      this.pxX += shiftX;
      this.pxY += shiftY;
      this.parentRect.x = newX;
      this.parentRect.y = newY;
    }
    // if (this.transform) {
    //   const t = this.transform;
    //   const pxNewX = t.scaleFactor * (newX + t.transX);
    //   const pxNewY = t.scaleFactor * (newY + t.transY);
    //   this.lines = this.shift(pxNewX - this.pxX, pxNewY - this.pxY, this.lines);
    //   this.pxX += pxNewX - this.pxX;
    //   this.pxY += pxNewY;
    // }
  }

  translate(x: number, y: number, d: DrawingParams, newTransform: Transform): void {
    if (this.transform) {
      const t = this.transform;
      const shiftX = d.x - t.scaleFactor * (x + t.transX);
      const shiftY = d.y - t.scaleFactor * (y + t.transY);
      this.lines = this.shift(shiftX, shiftY, this.lines);
      this.pxX += shiftX;
      this.pxY += shiftY;
      this.transform = newTransform;
    }
  }

  configure(
    c: CanvasRenderingContext2D,
    t: Transform,
    p: TextBoxProps,
    d: DrawingParams
  ): void {
    this.transform = t;
    c.save();
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    const f = this.parentProps;
    c.font = `${f.fontStyle} ${f.fontVariant} ${f.fontWeight} ${d.fontSize}px ${f.fontFamily}`;
    const unpositionedLines = this.getDisplayLines(c, p, d);
    this.lines = this.shift(d.x, d.y, this.alignLines(unpositionedLines, p, d));
    if (this.lines.length > 0) {
      const minX = this.lines.reduce((m, l) => (l.x < m ? l.x : m), 9999999);
      const maxWidth = this.lines.reduce((m, l) => (l.width > m ? l.width : m), 0);
      this.pxX = minX - d.pxPadding.left;
      this.pxWidth = maxWidth + d.pxPadding.left + d.pxPadding.right;
      this.pxY = this.lines[0].y - this.lines[0].fontBoundingBoxAscent - d.pxPadding.top;
      const linesHeight =
        this.lines.length > 0
          ? (this.lines.length - 1) * this.lines[0].height * p.lineHeight + this.lines[0].height
          : 0;
      this.pxHeight = linesHeight + d.pxPadding.top + d.pxPadding.bottom;
      this.setLineInsertBoundaries();
    } else {
      this.pxX = 0;
      this.pxY = 0;
      this.pxWidth = 0;
      this.pxHeight = 0;
    }
    c.restore();
  }

  draw(c: CanvasRenderingContext2D, t: Transform) {
    c.save();
    const p = this.parentProps;
    const color = ColorMapRef.resolve(p.color);
    let pxFontSize = ((t.scaleFactor * p.fontSizePt) / 72) * 25.4;
    pxFontSize = pxFontSize < 2 ? 2 : pxFontSize;
    c.fillStyle = color;
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    c.font = `${p.fontStyle} ${p.fontVariant} ${p.fontWeight} ${pxFontSize}px ${p.fontFamily}`;
    for (const line of this.lines) {
      c.fillText(line.text, line.x, line.y);
    }

    if (p.underline) {
      let underlineWidth = t.scaleFactor * 0.2;
      underlineWidth = underlineWidth < 1 ? 1 : underlineWidth;
      c.strokeStyle = color;
      c.lineWidth = underlineWidth;
      for (const line of this.lines) {
        if (line.xWords.length > 0) {
          const x1 = line.xWords[0].xStart;
          const x2 = line.xWords[line.xWords.length - 1].xEnd;
          c.beginPath();
          c.moveTo(x1, line.y + 2 * underlineWidth);
          c.lineTo(x2, line.y + 2 * underlineWidth);
          c.stroke();
        }
      }
    }
    c.restore();
  }

  findLineIndex(insertPosition: number): number {
    const ranges = this.lineInsertPointRanges();
    let result = 0;
    for (const range of ranges) {
      if (range.min <= insertPosition && insertPosition <= range.max) {
        return result;
      }
      result++;
    }
    return -1;
  }

  findInsertPositionFromPoint(p: Point): number {
    for (const line of this.lines) {
      const lineTop = line.y - line.fontBoundingBoxAscent;
      if (p.y >= lineTop && p.y <= lineTop + line.height) {
        if (p.x <= line.x) {
          return line.startInsertPosition;
        }
        if (p.x > line.x + line.width) {
          return line.endInsertPosition;
        }
        for (let i = line.xChars.length - 1; i > 0; i--) {
          if (p.x >= line.xChars[i]) {
            return line.startInsertPosition + i;
          }
        }
        return line.startInsertPosition;
      }
    }
    return -1;
  }

  insertPositionPoint(insertPosition: number): Point | null {
    const lineIndex = this.findLineIndex(insertPosition);
    if (lineIndex < 0 || lineIndex >= this.lines.length) {
      return null;
    }
    const line = this.lines[lineIndex];
    const charIndex = insertPosition - line.startInsertPosition;
    return {
      x: charIndex < line.xChars.length ? line.xChars[charIndex] : line.x + line.width,
      y: line.y - line.fontBoundingBoxAscent,
    };
  }

  private lineInsertPointRanges(): Range[] {
    const ranges: Range[] = [];
    let i = 0;
    for (const line of this.lines) {
      const startInsertPoint = i;
      const wrappedAdjust = line.wrapped ? 0 : 1;
      const endInsertPoint = line.text.length + wrappedAdjust - 1 + startInsertPoint;
      i = endInsertPoint + 1;
      ranges.push({ min: startInsertPoint, max: endInsertPoint });
    }
    return ranges;
  }

  private setLineInsertBoundaries() {
    let i = 0;
    for (const line of this.lines) {
      line.startInsertPosition = i;
      const wrappedAdjust = line.wrapped ? 0 : 1;
      line.endInsertPosition = line.text.length + wrappedAdjust - 1 + line.startInsertPosition;
      i = line.endInsertPosition + 1;
    }
  }
  /**
   *
   * @param c - canvas context
   * @param p - text box properties
   * @param d - drawing parameters
   * @returns - unpositioned display lines after any word wraps
   */
  private getDisplayLines(
    c: CanvasRenderingContext2D,
    p: TextBoxProps,
    d: DrawingParams
  ): DisplayLine[] {
    const linesOut: DisplayLine[] = [];
    for (const line of p.text.split(/\n/)) {
      linesOut.push(...this.processPhysicalLine(line, c, p, d, linesOut.length));
    }
    return linesOut;
  }

  /**
   *
   * @param x - x translation in pixels
   * @param y - y translation in pixels
   * @param lines - display lines to shift
   * @returns
   */
  private shift(x: number, y: number, lines: DisplayLine[]): DisplayLine[] {
    const linesOut: DisplayLine[] = [];
    for (const line of lines) {
      const xChars: number[] = [];
      for (const xChar of line.xChars) {
        xChars.push(xChar + x);
      }
      const xWords: DisplayWord[] = [];
      for (const xWord of line.xWords) {
        xWords.push({
          ...xWord,
          xStart: xWord.xStart + x,
          xEnd: xWord.xEnd + x,
        });
      }
      linesOut.push({
        ...line,
        x: line.x + x,
        y: line.y + y,
        xChars,
        xWords,
      });
    }
    return linesOut;
  }

  /**
   *
   * @param physicalLine - part of text box string
   * @param c
   * @param p
   * @param d
   * @param row
   * @returns
   */
  private processPhysicalLine(
    physicalLine: string,
    c: CanvasRenderingContext2D,
    p: TextBoxProps,
    d: DrawingParams,
    row: number
  ): DisplayLine[] {
    const linesOut: DisplayLine[] = [];
    // Get text metrics for physical line and construct a display
    // line object for the whole line
    let line = physicalLine.slice();
    let m = c.measureText(line);
    let displayLine = this.getDisplayLine(line, c, p, m, row);

    // If wordwrap is true and the display line width is greater than
    // the text box width and there is more than one word break the
    // physical line to try and fit within the text box width
    const availableWidth = d.width - d.pxPadding.left - d.pxPadding.right;
    while (p.wordwrap && displayLine.width > availableWidth && displayLine.xWords.length > 1) {
      // Find the first word in the display line that doesn't fit
      // completely in the text box width
      const firstOverflowWordIndex = this.findFirstOverflowWordIndex(d, displayLine);
      linesOut.push(this.sliceByWord(displayLine, firstOverflowWordIndex));
      row++;
      line = line.slice(displayLine.xWords[firstOverflowWordIndex].idxStart);
      m = c.measureText(line);
      displayLine = this.getDisplayLine(line, c, p, m, row);
    }
    linesOut.push(displayLine);
    return linesOut;
  }

  /**
   *
   * @param d - drawing parameters passed from text box
   * @param displayLine  - display line to analyse
   * @returns - zero-based index of first word to overflow the available
   *            width - if the first word overflows then return 1
   */
  private findFirstOverflowWordIndex(
    d: DrawingParams,
    displayLine: DisplayLine // add availableWidth as parameter
  ): number {
    let result = 0;
    const availableWidth = d.width - d.pxPadding.left - d.pxPadding.right;
    for (let i = 0; i < displayLine.xWords.length; i++) {
      if (displayLine.xWords[i].xEnd > availableWidth) {
        result = i;
        break;
      }
    }
    return result === 0 ? 1 : result;
  }

  /**
   *
   * @param displayLine - display line to be sliced
   * @param end - zero-based index of first word to overflow available width
   * @returns - sliced display line ready for word wrap
   */
  private sliceByWord(displayLine: DisplayLine, end: number): DisplayLine {
    const endOfChars = displayLine.xWords[end].idxStart;
    return {
      ...displayLine,
      text: displayLine.text.slice(0, endOfChars),
      width: displayLine.xWords[end].xStart,
      xChars: displayLine.xChars.slice(0, endOfChars),
      xWords: displayLine.xWords.slice(0, end),
      wrapped: true,
    };
  }

  /**
   *
   * @param s - display line after word wrap (if enabled)
   * @param c - canvas context
   * @param p - text box properties
   * @param m - canvas text metrics for the display line
   * @param row - number of text row in text block (zero-based)
   * @returns - an unpositioned display line
   */
  private getDisplayLine(
    s: string,
    c: CanvasRenderingContext2D,
    p: TextBoxProps,
    m: TextMetrics,
    row: number
  ): DisplayLine {
    const xChars = this.getXChars(s, c);
    const xWords = this.getXWords(s, m, xChars);
    const height = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
    return {
      x: 0,
      y: m.fontBoundingBoxAscent + p.lineHeight * row * height,
      text: s,
      width: m.width,
      height,
      fontBoundingBoxAscent: m.fontBoundingBoxAscent,
      fontBoundingBoxDescent: m.fontBoundingBoxDescent,
      xChars,
      xWords,
      wrapped: false,
      startInsertPosition: 0,
      endInsertPosition: 0,
    };
  }

  /**
   *
   * @param s - display line after word wrap (if enabled)
   * @param c - canvas context
   * @returns - array of x pixel coords for start of each character,
   *            including spaces, in the display line
   */
  private getXChars(s: string, c: CanvasRenderingContext2D): number[] {
    const xChars: number[] = [];
    if (s.length > 0) {
      xChars.push(0);
      for (let i = 1; i <= s.length - 1; i++) {
        const m = c.measureText(s.slice(0, i));
        xChars.push(m.width);
      }
    }
    return xChars;
  }

  /**
   *
   * @param s - display line after word wrap (if enabled)
   * @param m - canvas text metrics for the display line
   * @param xChars - array of x pixel coords for start of each character,
   *                 including spaces, in the display line
   * @returns
   */
  private getXWords(s: string, m: TextMetrics, xChars: number[]): DisplayWord[] {
    const xWords: DisplayWord[] = [];
    const whitespace = / /;
    const words = s.split(whitespace);
    let end = 0;
    for (let w = 0; w < words.length; w++) {
      if (words[w].length > 0) {
        const start = s.slice(end).indexOf(words[w]) + end;
        end = start + words[w].length;
        if (end < s.length) {
          xWords.push({
            idxStart: start,
            idxEnd: end,
            xStart: xChars[start],
            xEnd: xChars[end],
          });
        } else {
          xWords.push({
            idxStart: start,
            idxEnd: end,
            xStart: xChars[start],
            xEnd: m.width,
          });
        }
      }
    }
    return xWords;
  }

  /**
   *
   * @param lines - display lines to align
   * @param p - text box properties
   * @param d - drawing parameters from text box
   * @returns - aligned display lines
   */
  private alignLines(lines: DisplayLine[], p: TextBoxProps, d: DrawingParams): DisplayLine[] {
    let linesOut = this.alignHorizontally(lines, p, d);
    linesOut = this.alignVertically(linesOut, p, d);
    return linesOut;
  }

  /**
   *
   * @param lines - display lines to align
   * @param p - text box properties
   * @param d - drawing parameters from text box
   * @returns - aligned display lines
   */
  private alignHorizontally(
    lines: DisplayLine[],
    p: TextBoxProps,
    d: DrawingParams
  ): DisplayLine[] {
    if (p.alignment.horizontal === 'left') {
      if (d.pxPadding.left === 0) {
        return lines;
      }
      return this.alignHorizontal(lines, d, 'left');
    }
    if (p.alignment.horizontal === 'right') {
      return this.alignHorizontal(lines, d, 'right');
    }
    return this.alignHorizontal(lines, d, 'center');
  }

  /**
   *
   * @param lines - display lines to align
   * @param d - drawing parameters
   * @param alignment - horizontal alignment
   * @returns - aligned display lines
   */
  private alignHorizontal(
    lines: DisplayLine[],
    d: DrawingParams,
    alignment: HorizontalAlignment
  ): DisplayLine[] {
    const linesOut: DisplayLine[] = [];
    const paddingShift = (d.pxPadding.right - d.pxPadding.left) / 2;
    for (const line of lines) {
      const shiftX =
        alignment === 'left'
          ? d.pxPadding.left
          : alignment === 'center'
          ? d.width / 2 - line.width / 2 - paddingShift
          : d.width - line.width - d.pxPadding.right;
      const xChars: number[] = [];
      for (const xChar of line.xChars) {
        xChars.push(xChar + shiftX);
      }
      const xWords: DisplayWord[] = [];
      for (const xWord of line.xWords) {
        xWords.push({
          ...xWord,
          xStart: xWord.xStart + shiftX,
          xEnd: xWord.xEnd + shiftX,
        });
      }
      linesOut.push({
        ...line,
        x: line.x + shiftX,
        text: line.text.slice(),
        xChars,
        xWords,
      });
    }
    return linesOut;
  }

  /**
   *
   * @param lines - display lines to align vertically
   * @param p - text box properties
   * @param d - drawing parameters from text box
   * @returns - aligned display lines
   */
  private alignVertically(
    lines: DisplayLine[],
    p: TextBoxProps,
    d: DrawingParams
  ): DisplayLine[] {
    if (p.alignment.vertical === 'top') {
      if (d.pxPadding.top === 0) {
        return lines;
      }
      return this.alignVertical(lines, p, d, 'top');
    }
    if (p.alignment.vertical === 'bottom') {
      return this.alignVertical(lines, p, d, 'bottom');
    }
    return this.alignVertical(lines, p, d, 'center');
  }

  /**
   *
   * @param lines display lines to align vertically
   * @param p - text box properties
   * @param d - drawing parameters from text box
   * @param alignment - vertical alignment
   * @returns
   */
  private alignVertical(
    lines: DisplayLine[],
    p: TextBoxProps,
    d: DrawingParams,
    alignment: VerticalAlignment
  ): DisplayLine[] {
    const linesOut: DisplayLine[] = [];
    const paddingShift = (d.pxPadding.bottom - d.pxPadding.top) / 2;
    const linesHeight =
      lines.length > 0
        ? (lines.length - 1) * lines[0].height * p.lineHeight + lines[0].height
        : 0;
    const shiftY =
      alignment === 'top'
        ? d.pxPadding.top
        : alignment === 'center'
        ? d.height / 2 - linesHeight / 2 - paddingShift
        : d.height - linesHeight - d.pxPadding.bottom;
    for (const line of lines) {
      linesOut.push({
        ...line,
        y: line.y + shiftY,
        text: line.text.slice(), // not sure this needs to be copied
      });
    }
    return linesOut;
  }
}
