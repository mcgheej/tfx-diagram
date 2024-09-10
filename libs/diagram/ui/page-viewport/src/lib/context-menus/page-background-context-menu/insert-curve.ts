import { Store } from '@ngrx/store';
import { PageBackgroundContextMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectTransform } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Curve, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
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

export function getInsertCurve(
  store: Store,
  mb: MenuBuilderService,
  position: Point
): CommandItem {
  return mb.commandItem({
    label: 'Insert Curve',
    exec: insertCurve(store, position),
  });
}

function insertCurve(store: Store, position: Point): (commandItem: CommandItem) => void {
  return () => {
    combineLatest([
      store.select(selectLineColor),
      store.select(selectLineWidth),
      store.select(selectLineDash),
      store.select(selectEndpoints),
      store.select(selectTransform),
    ])
      .pipe(take(1))
      .subscribe(([lineColor, lineWidth, lineDash, endpoints, transform]) => {
        if (transform) {
          const { x, y } = inverseTransform(position, transform);
          const x1 = x - 10;
          const startEndpoint = endpoints.startEndpoint ? endpoints.startEndpoint.copy() : null;
          const finishEndpoint = endpoints.finishEndpoint
            ? endpoints.finishEndpoint.copy()
            : null;
          store.dispatch(
            PageBackgroundContextMenuActions.insertCurve({
              shape: new Curve({
                id: Shape.generateId(),
                controlPoints: [
                  { x: x1, y },
                  { x: x1 + 9, y: y + 9 },
                  { x: x1 + 11, y: y - 9 },
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
