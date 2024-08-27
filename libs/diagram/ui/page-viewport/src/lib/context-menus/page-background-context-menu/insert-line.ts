import { Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { PageBackgroundContextMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectTransform } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Line } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  selectEndpoints,
  selectLineColor,
  selectLineDash,
  selectLineWidth,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { combineLatest, take } from 'rxjs';

export function getInsertLine(
  store: Store,
  mb: MenuBuilderService,
  position: Point
): CommandItem {
  return mb.commandItem({
    label: 'Insert Line',
    exec: insertLine(store, position),
  });
}

function insertLine(store: Store, position: Point): (commandItem: CommandItem) => void {
  return () => {
    combineLatest([
      store.select(selectLineColor),
      store.select(selectLineDash),
      store.select(selectLineWidth),
      store.select(selectEndpoints),
      store.select(selectTransform),
    ])
      .pipe(take(1))
      .subscribe(([lineColor, lineDash, lineWidth, endpoints, transform]) => {
        if (transform) {
          const { x, y } = inverseTransform(position, transform);
          const x1 = x - 10;
          const startEndpoint = endpoints.startEndpoint ? endpoints.startEndpoint.copy() : null;
          const finishEndpoint = endpoints.finishEndpoint
            ? endpoints.finishEndpoint.copy()
            : null;
          store.dispatch(
            PageBackgroundContextMenuActions.insertLine({
              shape: new Line({
                id: Shape.generateId(),
                controlPoints: [
                  { x: x1, y },
                  { x: x1 + 20, y },
                ],
                strokeStyle: lineColor,
                lineDash,
                lineWidth,
                startEndpoint,
                finishEndpoint,
              }),
            })
          );
        }
      });
  };
}
