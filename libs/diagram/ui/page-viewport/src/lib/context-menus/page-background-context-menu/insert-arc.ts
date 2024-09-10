import { Store } from '@ngrx/store';
import { Arc, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { PageBackgroundContextMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectTransform } from '@tfx-diagram/diagram-data-access-store-features-transform';
import {
  selectFillColor,
  selectLineColor,
  selectLineDash,
  selectLineWidth,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { combineLatest, take } from 'rxjs';

export function getInsertArc(
  store: Store,
  mb: MenuBuilderService,
  position: Point
): CommandItem {
  return mb.commandItem({
    label: 'Insert Arc',
    exec: insertArc(store, position),
  });
}

function insertArc(store: Store, position: Point): (CommandItem: CommandItem) => void {
  return () => {
    combineLatest([
      store.select(selectLineColor),
      store.select(selectFillColor),
      store.select(selectLineWidth),
      store.select(selectLineDash),
      store.select(selectTransform),
    ])
      .pipe(take(1))
      .subscribe(([lineColor, fillColor, lineWidth, lineDash, transform]) => {
        if (transform) {
          const { x, y } = inverseTransform(position, transform);
          store.dispatch(
            PageBackgroundContextMenuActions.insertArc({
              shape: new Arc({
                id: Shape.generateId(),
                x,
                y,
                radius: 15,
                sAngle: 30,
                eAngle: 15,
                strokeStyle: lineColor,
                fillStyle: fillColor,
                lineDash,
                lineWidth,
              }),
            })
          );
        }
      });
  };
}
