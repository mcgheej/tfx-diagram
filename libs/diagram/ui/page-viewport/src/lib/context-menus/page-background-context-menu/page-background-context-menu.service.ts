import { Injectable } from '@angular/core';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

@Injectable()
export class PageBackgroundContextMenuService {
  open({ x, y }: Point) {
    console.log(`Open menu at (${x}, ${y})`);
  }
}
