import { Store } from '@ngrx/store';
import { Rectangle, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { InsertMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectPageWindow } from '@tfx-diagram/diagram-data-access-store-features-transform';
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

export class InsertRectangleCommand {
  private item = this.mb.commandItem({
    label: 'Insert Rectangle',
    exec: this.insertRectangle(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private insertRectangle(): (commandItem: CommandItem) => void {
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
          const rWidth = 30;
          const rHeight = 20;
          const w = pageWindow as Rect;
          const x = Math.round((w.x + w.width / 2 - rWidth / 2) / 5) * 5;
          const y = Math.round((w.y + w.height / 2 - rHeight / 2) / 5) * 5;
          this.store.dispatch(
            InsertMenuActions.insertRectangle({
              shape: new Rectangle({
                id: Shape.generateId(),
                x,
                y,
                width: rWidth,
                height: rHeight,
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
