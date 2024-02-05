import { Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { InsertMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectPageWindow } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Triangle } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  selectFillColor,
  selectFontProps,
  selectLineColor,
  selectLineDash,
  selectLineWidth,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { combineLatest, filter, take } from 'rxjs';

export class InsertTriangleCommand {
  private item = this.mb.commandItem({
    label: 'Insert Triangle',
    exec: this.insertTriangle(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private insertTriangle(): (commandItem: CommandItem) => void {
    return () => {
      combineLatest([
        this.store.select(selectPageWindow),
        this.store.select(selectLineColor),
        this.store.select(selectFillColor),
        this.store.select(selectLineDash),
        this.store.select(selectLineWidth),
        this.store.select(selectFontProps),
      ])
        .pipe(
          take(1),
          filter((pageWindow) => pageWindow !== null)
        )
        .subscribe(([pageWindow, lineColor, fillColor, lineDash, lineWidth, textConfig]) => {
          const w = pageWindow as Rect;
          const x = Math.round((w.x + w.width / 2) / 5) * 5;
          const y = Math.round((w.y + w.height / 2) / 5) * 5;
          this.store.dispatch(
            InsertMenuActions.insertTriangle({
              shape: new Triangle({
                id: Shape.generateId(),
                vertices: [
                  { x, y: y - 10 },
                  { x: x + 10, y: y + 10 },
                  { x: x - 10, y: y + 10 },
                ],
                strokeStyle: lineColor,
                fillStyle: fillColor,
                lineDash,
                lineWidth,
                textConfig,
              }),
            })
          );
        });
    };
  }
}
