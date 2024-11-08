import {
  rectBottomLine,
  rectInflate,
  rectLeftLine,
  rectRightLine,
  rectTopLine,
} from '@tfx-diagram/diagram/util/misc-functions';
import { Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { PathOperation, RectangleCornerArc, RectangleSegment } from '../../../../types';
import { RectangleRadii } from '../../../../types/rectangle-radii.type';

export function computeCornerRadii(
  corners: string,
  rectWidth: number,
  rectHeight: number
): RectangleRadii {
  if (corners === '') {
    return [0, 0, 0, 0];
  }
  const r: RectangleRadii = [0, 0, 0, 0];
  const values = corners.split(' ');
  if (values.length > 4) {
    return r;
  }

  const cornerRadius: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (!/^0|[1-9]\d*$/.exec(values[i])) {
      return [0, 0, 0, 0];
    }
    cornerRadius.push(+values[i]);
  }

  if (cornerRadius.length === 1) {
    r[0] = cornerRadius[0];
    r[1] = r[0];
    r[2] = r[0];
    r[3] = r[0];
  } else if (cornerRadius.length === 2) {
    r[0] = cornerRadius[0];
    r[1] = cornerRadius[1];
    r[2] = r[0];
    r[3] = r[1];
  } else if (cornerRadius.length === 3) {
    r[0] = cornerRadius[0];
    r[1] = cornerRadius[1];
    r[2] = cornerRadius[2];
    r[3] = cornerRadius[1];
  } else if (cornerRadius.length > 3) {
    r[0] = cornerRadius[0];
    r[1] = cornerRadius[1];
    r[2] = cornerRadius[2];
    r[3] = cornerRadius[3];
  }
  let t = adjustSide(r[0], r[1], rectWidth);
  r[0] = t[0];
  r[1] = t[1];
  t = adjustSide(r[1], r[2], rectHeight);
  r[1] = t[0];
  r[2] = t[1];
  t = adjustSide(r[2], r[3], rectWidth);
  r[2] = t[0];
  r[3] = t[1];
  t = adjustSide(r[3], r[0], rectHeight);
  r[3] = t[0];
  r[0] = t[1];
  return r;
}

export function constructSegments(
  x: number,
  y: number,
  width: number,
  height: number,
  cornerRadii: RectangleRadii,
  t: Transform,
  halfLineWidth: number
): RectangleSegment[] {
  const pxR = transformRadii(cornerRadii, t, halfLineWidth * t.scaleFactor);
  const mmR = cornerRadii;

  // Calculate inflated rectangle (iR) and get edge line segments
  const iR = rectInflate({ x, y, width, height }, halfLineWidth);
  const top = rectTopLine(iR);
  const right = rectRightLine(iR);
  const bottom = rectBottomLine(iR);
  const left = rectLeftLine(iR);

  if (allSquareCorners(pxR)) {
    return [undefined, top, undefined, right, undefined, bottom, undefined, left];
  }

  const result: RectangleSegment[] = Array(8).fill(undefined);
  if (pxR[0] !== 0) {
    const c = mmR[0] + halfLineWidth;
    result[0] = { x: iR.x + c, y: iR.y + c, r: c } as RectangleCornerArc;
    top.a = { x: iR.x + c, y: iR.y };
    left.a = { x: iR.x, y: iR.y + c };
  }

  if (pxR[1] !== 0) {
    const c = mmR[1] + halfLineWidth;
    result[2] = { x: iR.x + iR.width - c, y: iR.y + c, r: c };
    top.b = { x: iR.x + iR.width - c, y: iR.y };
    right.a = { x: iR.x + iR.width, y: iR.y + c };
  }
  result[1] = top;

  if (pxR[2] !== 0) {
    const c = mmR[2] + halfLineWidth;
    result[4] = { x: iR.x + iR.width - c, y: iR.y + iR.height - c, r: c };
    right.b = { x: iR.x + iR.width, y: iR.y + iR.height - c };
    bottom.b = { x: iR.x + iR.width - c, y: iR.y + iR.height };
  }
  result[3] = right;

  if (pxR[3] !== 0) {
    const c = mmR[3] + halfLineWidth;
    result[6] = { x: iR.x + c, y: iR.y + iR.height - c, r: c };
    bottom.a = { x: iR.x + c, y: iR.y + iR.height };
    left.b = { x: iR.x, y: iR.y + iR.height - c };
  }
  result[5] = bottom;
  result[7] = left;

  return result;
}

export function constructPath(
  x: number,
  y: number,
  width: number,
  height: number,
  cornerRadii: RectangleRadii,
  transform: Transform,
  inflationPx = 0
): PathOperation[] {
  const r = transformRadii(cornerRadii, transform, inflationPx);

  // Recular rectangular with square corners
  if (allSquareCorners(r)) {
    return [{ opCode: 'rect', params: [x, y, width, height] }];
  }

  const ops: PathOperation[] = [];

  // Start position
  ops.push({ opCode: 'moveTo', params: r[0] === 0 ? [x, y] : [x + r[0], y] });

  // To end of top right corner
  if (r[1] === 0) {
    ops.push({ opCode: 'lineTo', params: [x + width, y] });
  } else {
    ops.push({ opCode: 'lineTo', params: [x + width - r[1], y] });
    ops.push({ opCode: 'arcTo', params: [x + width, y, x + width, y + r[1], r[1]] });
  }

  // To end of bottom right corner
  if (r[2] === 0) {
    ops.push({ opCode: 'lineTo', params: [x + width, y + height] });
  } else {
    ops.push({ opCode: 'lineTo', params: [x + width, y + height - r[2]] });
    ops.push({
      opCode: 'arcTo',
      params: [x + width, y + height, x + width - r[2], y + height, r[2]],
    });
  }

  // To end of bottom left corner
  if (r[3] === 0) {
    ops.push({ opCode: 'lineTo', params: [x, y + height] });
  } else {
    ops.push({ opCode: 'lineTo', params: [x + r[3], y + height] });
    ops.push({ opCode: 'arcTo', params: [x, y + height, x, y + height - r[3], r[3]] });
  }

  // To end of top left corner
  if (r[0] === 0) {
    ops.push({ opCode: 'lineTo', params: [x, y] });
  } else {
    ops.push({ opCode: 'lineTo', params: [x, y + r[0]] });
    ops.push({ opCode: 'arcTo', params: [x, y, x + r[0], y, r[0]] });
  }

  // And finish off line
  if (r[1] === 0) {
    ops.push({ opCode: 'lineTo', params: [x + width, y] });
  } else {
    ops.push({ opCode: 'lineTo', params: [x + width - r[1], y] });
  }
  return ops;
}

export function executePathOperations(
  operations: PathOperation[],
  c: CanvasRenderingContext2D
) {
  operations.map((p) => {
    switch (p.opCode) {
      case 'rect': {
        if (p.params.length === 4) {
          c.rect(p.params[0], p.params[1], p.params[2], p.params[3]);
        }
        break;
      }
      case 'moveTo': {
        if (p.params.length === 2) {
          c.moveTo(p.params[0], p.params[1]);
        }
        break;
      }
      case 'lineTo': {
        if (p.params.length === 2) {
          c.lineTo(p.params[0], p.params[1]);
        }
        break;
      }
      case 'arcTo': {
        if (p.params.length === 5) {
          c.arcTo(p.params[0], p.params[1], p.params[2], p.params[3], p.params[4]);
        }
        break;
      }
    }
  });
}

function adjustSide(r1: number, r2: number, sideLength: number): [number, number] {
  if (r1 + r2 <= sideLength) {
    return [r1, r2];
  }
  if (r1 === 0) {
    return [r1, sideLength];
  }
  if (r2 === 0) {
    return [sideLength, r2];
  }
  const modifiedR1 = sideLength / (1 + r2 / r1);
  return [modifiedR1, sideLength - modifiedR1];
}

function allSquareCorners(radius: RectangleRadii): boolean {
  if (radius[0] !== 0 || radius[1] !== 0 || radius[2] !== 0 || radius[3] !== 0) {
    return false;
  }
  return true;
}

function transformRadii(
  cornerRadii: RectangleRadii,
  t: Transform,
  inflationPx: number
): RectangleRadii {
  return cornerRadii.map((r) => {
    const a = r * t.scaleFactor;
    return a >= 3 ? a + inflationPx : 0;
  }) as RectangleRadii;
}
