import { Store } from '@ngrx/store';
import { Arc, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { InsertMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectPageWindow } from '@tfx-diagram/diagram-data-access-store-features-transform';
import {
  selectFillColor,
  selectLineColor,
  selectLineDash,
  selectLineWidth,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { combineLatest, filter, take } from 'rxjs';

export class InsertArcCommand {
  private item = this.mb.commandItem({
    label: 'Insert Arc',
    exec: this.insertArc(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private insertArc(): (commandItem: CommandItem) => void {
    return () => {
      combineLatest([
        this.store.select(selectPageWindow),
        this.store.select(selectLineColor),
        this.store.select(selectFillColor),
        this.store.select(selectLineWidth),
        this.store.select(selectLineDash),
      ])
        .pipe(
          take(1),
          filter((pageWindow) => pageWindow !== null)
        )
        .subscribe(([pageWindow, lineColor, fillColor, lineWidth, lineDash]) => {
          const w = pageWindow as Rect;
          const x = Math.round((w.x + w.width / 2) / 5) * 5;
          const y = Math.round((w.y + w.height / 2) / 5) * 5;
          this.store.dispatch(
            InsertMenuActions.insertArc({
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
                // circleSegment: true,
              }),
            })
          );
          // const a = [30, 30, 30, 30, 60];
          // const b = [60, 120, 200, 310, 20];
          // let q = 25;
          // for (let i = 0; i < 4; i++) {
          //   let p = 25;
          //   for (let j = 0; j < 5; j++) {
          //     this.store.dispatch(
          //       InsertMenuActions.insertArc({
          //         shape: new Arc({
          //           id: Shape.generateId(),
          //           x: p,
          //           y: q,
          //           radius: 15,
          //           sAngle: a[j] + 90 * i,
          //           eAngle: b[j] + 90 * i,
          //           strokeStyle: lineColor,
          //           fillStyle: fillColor,
          //           lineDash,
          //           lineWidth,
          //           circleSegment: true,
          //         }),
          //       })
          //     );
          //     p += 35;
          //   }
          //   q += 35;
          // }
        });
    };
  }
}
