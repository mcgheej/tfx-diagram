import { Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { PageBackgroundContextMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectTransform } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Triangle } from '@tfx-diagram/diagram/data-access/shape-classes';
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

export function getInsertTriangle(
  store: Store,
  mb: MenuBuilderService,
  position: Point
): CommandItem {
  return mb.commandItem({
    label: 'Insert Triangle',
    exec: insertTriangle(store, position),
  });
}

function insertTriangle(store: Store, position: Point): (commandItem: CommandItem) => void {
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
          const { x, y } = inverseTransform(position, transform);
          store.dispatch(
            PageBackgroundContextMenuActions.insertTriangle({
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
        }
      });
  };
}
