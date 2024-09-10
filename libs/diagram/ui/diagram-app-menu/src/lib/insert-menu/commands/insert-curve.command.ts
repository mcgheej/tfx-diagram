import { Store } from '@ngrx/store';
import { InsertMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectPageWindow } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Curve, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  selectEndpoints,
  selectLineColor,
  selectLineDash,
  selectLineWidth,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { combineLatest, filter, take } from 'rxjs';

export class InsertCurveCommand {
  private item = this.mb.commandItem({
    label: 'Insert Curve',
    exec: this.insertCurve(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private insertCurve(): (commandItem: CommandItem) => void {
    return () => {
      combineLatest([
        this.store.select(selectPageWindow),
        this.store.select(selectLineColor),
        this.store.select(selectLineWidth),
        this.store.select(selectLineDash),
        this.store.select(selectEndpoints),
      ])
        .pipe(
          take(1),
          filter((pageWindow) => pageWindow !== null)
        )
        .subscribe(([pageWindow, lineColor, lineWidth, lineDash, endpoints]) => {
          const w = pageWindow as Rect;
          const x1 = Math.round((w.x + w.width / 2 - 10) / 5) * 5;
          const y = Math.round((w.y + w.height / 2) / 5) * 5;
          const startEndpoint = endpoints.startEndpoint ? endpoints.startEndpoint.copy() : null;
          const finishEndpoint = endpoints.finishEndpoint
            ? endpoints.finishEndpoint.copy()
            : null;
          this.store.dispatch(
            InsertMenuActions.insertCurve({
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
        });
    };
  }
}

// const xb = randomNumber(10, 80);
// const yb = randomNumber(10, 100);

// this.store.dispatch(
//   InsertMenuActions.insertCurve({
//     shape: new Curve({
//       id: Shape.generateId(),
//       controlPoints: [
//         { x: xb + 0, y: yb + 60 },
//         { x: xb + 0, y: yb + 20 },
//         { x: xb + 40, y: yb + 20 },
//         { x: xb + 60, y: yb + 60 },
//         { x: xb + 80, y: yb + 100 },
//         { x: xb + 60, y: yb + 0 },
//         { x: xb + 100, y: yb + 40 },
//         { x: xb + 120, y: yb + 60 },
//         { x: xb + 120, y: yb + 20 },
//         { x: xb + 140, y: yb + 60 },
//       ],
//       strokeStyle: lineColor,
//       lineWidth: lineWidth,
//       startEndpoint,
//       finishEndpoint,
//     }),
//   })
// );
