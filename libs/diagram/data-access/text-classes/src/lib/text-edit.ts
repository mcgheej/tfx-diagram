import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { TextBlock } from './text-block';
import { TextBox } from './text-box';
import { SelectionSpan } from './text-box.types';

export interface TextEditConfig {
  associatedShapeId: string;
  insertPosition?: number;
  selectionSpan?: SelectionSpan;
}

export class TextEdit {
  associatedShapeId: string;
  insertPosition: number;
  selectionSpan: SelectionSpan;

  constructor(config: TextEditConfig) {
    this.associatedShapeId = config.associatedShapeId;
    this.insertPosition = config.insertPosition ?? 0;
    this.selectionSpan = config.selectionSpan
      ? config.selectionSpan
      : { start: this.insertPosition, end: this.insertPosition };
  }

  textBlock(): TextBlock | undefined {
    return TextBox.textBlockCache.get(this.associatedShapeId);
  }

  /**
   *
   * @returns Position for text cursor calculated from current insert point
   */
  cursorPosition(): Point | null {
    const textBlock = TextBox.textBlockCache.get(this.associatedShapeId);
    if (textBlock) {
      let rowP1 = 0;
      let row = 0;
      while (row < textBlock.lines.length) {
        const line = textBlock.lines[row];
        const lineTextLength = line.text.length;
        const rowPs = line.wrapped ? lineTextLength : lineTextLength + 1;
        const nextRowP1 = rowP1 + rowPs;
        if (this.insertPosition < nextRowP1) {
          const y = line.y - line.fontBoundingBoxAscent;
          const p = this.insertPosition - rowP1;
          const x = p < line.xChars.length ? line.xChars[p] : line.x + line.width;
          return { x, y };
        }
        rowP1 = nextRowP1;
        row++;
      }
      //
    }
    return null;
  }

  textSelectionRects(): Rect[] {
    if (this.selectionSpan.start === this.selectionSpan.end) {
      return [];
    }
    const result: Rect[] = [];
    const textBlock = TextBox.textBlockCache.get(this.associatedShapeId);
    if (textBlock) {
      let start = this.selectionSpan.start;
      let end = this.selectionSpan.end;
      if (end < start) {
        const temp = start;
        start = end;
        end = temp;
      }
      const rowStart = textBlock.findLineIndex(start);
      const rowEnd = textBlock.findLineIndex(end);
      for (let i = rowStart; i <= rowEnd; i++) {
        const line = textBlock.lines[i];
        const p1 =
          i === rowStart
            ? textBlock.insertPositionPoint(start)
            : { x: line.x, y: line.y - line.fontBoundingBoxAscent };
        const p2 =
          i === rowEnd
            ? textBlock.insertPositionPoint(end)
            : { x: line.x + line.width, y: line.y - line.fontBoundingBoxAscent };
        if (p1 && p2) {
          result.push({
            x: p1.x,
            y: p1.y,
            width: p2.x - p1.x,
            height: line.height,
          });
        }
      }
    }
    return result;
  }

  shadowRects(): Rect[] {
    const result: Rect[] = [];
    const textBlock = TextBox.textBlockCache.get(this.associatedShapeId);
    if (textBlock) {
      for (const line of textBlock.lines) {
        result.push({
          x: line.x - 15,
          y: line.y - line.fontBoundingBoxAscent,
          width: line.width + 30,
          height: line.height,
        });
      }
    }
    return result;
  }

  resetSelectionSpan(insertPosition: number) {
    this.selectionSpan = { start: insertPosition, end: insertPosition };
  }

  changeSelectionSpan(insertPosition: number) {
    this.selectionSpan.end = insertPosition;
  }
}
