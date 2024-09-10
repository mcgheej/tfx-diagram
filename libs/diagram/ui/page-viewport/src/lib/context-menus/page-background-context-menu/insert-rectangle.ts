import { Store } from '@ngrx/store';
import { PageBackgroundContextMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectTransform } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Rectangle, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  selectFillColor,
  selectFontProps,
  selectLineColor,
  selectLineDash,
  selectLineWidth,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { combineLatest, take } from 'rxjs';

export function getInsertRectangle(
  store: Store,
  mb: MenuBuilderService,
  position: Point
): CommandItem {
  return mb.commandItem({
    label: 'Insert Rectangle',
    exec: insertRectangle(store, position),
  });
}

function insertRectangle(store: Store, position: Point): (commandItem: CommandItem) => void {
  return () => {
    combineLatest([
      store.select(selectLineColor),
      store.select(selectFillColor),
      store.select(selectLineDash),
      store.select(selectLineWidth),
      store.select(selectFontProps),
      store.select(selectTransform),
    ])
      .pipe(take(1))
      .subscribe(([lineColor, fillColor, lineDash, lineWidth, textConfig, transform]) => {
        if (transform) {
          const rWidth = 30;
          const rHeight = 20;
          const { x, y } = inverseTransform(position, transform);
          store.dispatch(
            PageBackgroundContextMenuActions.insertRectangle({
              shape: new Rectangle({
                id: Shape.generateId(),
                x: Math.round(x - rWidth / 2),
                y: Math.round(y - rHeight / 2),
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
        }
      });
  };
}
