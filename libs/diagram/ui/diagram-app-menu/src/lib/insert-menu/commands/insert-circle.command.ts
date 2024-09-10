import { Store } from '@ngrx/store';
import { InsertMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectPageWindow } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Circle, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
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

export class InsertCircleCommand {
  private item = this.mb.commandItem({
    label: 'Insert Circle',
    exec: this.insertCircle(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private insertCircle(): (commandItem: CommandItem) => void {
    return () => {
      combineLatest([
        this.store.select(selectPageWindow),
        this.store.select(selectLineColor),
        this.store.select(selectFillColor),
        this.store.select(selectLineWidth),
        this.store.select(selectLineDash),
        this.store.select(selectFontProps),
      ])
        .pipe(
          take(1),
          filter((pageWindow) => pageWindow !== null)
        )
        .subscribe(([pageWindow, lineColor, fillColor, lineWidth, lineDash, textConfig]) => {
          const w = pageWindow as Rect;
          const x = Math.round((w.x + w.width / 2) / 5) * 5;
          const y = Math.round((w.y + w.height / 2) / 5) * 5;
          this.store.dispatch(
            InsertMenuActions.insertCircle({
              shape: new Circle({
                id: Shape.generateId(),
                x,
                y,
                radius: 15,
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
