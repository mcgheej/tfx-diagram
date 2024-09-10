import { Store } from '@ngrx/store';
import {
  Circle,
  Rectangle,
  Shape,
  Triangle,
} from '@tfx-diagram/diagram-data-access-shape-base-class';
import { InsertMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectFillColor,
  selectFontProps,
  selectLineColor,
  selectLineDash,
  selectLineWidth,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { combineLatest, filter, take } from 'rxjs';

export class InsertTestCommand {
  private item = this.mb.commandItem({
    label: 'Insert Test',
    exec: this.insertTest(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private insertTest(): (commandItem: CommandItem) => void {
    return () => {
      combineLatest([
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
        .subscribe(([lineColor, fillColor, lineDash, lineWidth, textConfig]) => {
          this.store.dispatch(
            InsertMenuActions.insertRectangle({
              shape: new Rectangle({
                id: Shape.generateId(),
                x: 25,
                y: 20,
                width: 100,
                height: 75,
                strokeStyle: lineColor,
                fillStyle: fillColor,
                lineDash,
                lineWidth,
                textConfig,
              }),
            })
          );
          this.store.dispatch(
            InsertMenuActions.insertCircle({
              shape: new Circle({
                id: Shape.generateId(),
                x: 50,
                y: 45,
                radius: 15,
                strokeStyle: lineColor,
                fillStyle: fillColor,
                lineDash,
                lineWidth,
                textConfig,
              }),
            })
          );
          this.store.dispatch(
            InsertMenuActions.insertCircle({
              shape: new Circle({
                id: Shape.generateId(),
                x: 100,
                y: 45,
                radius: 15,
                strokeStyle: lineColor,
                fillStyle: fillColor,
                lineDash,
                lineWidth,
                textConfig,
              }),
            })
          );
          this.store.dispatch(
            InsertMenuActions.insertTriangle({
              shape: new Triangle({
                id: Shape.generateId(),
                vertices: [
                  { x: 75, y: 55 },
                  { x: 85, y: 75 },
                  { x: 65, y: 75 },
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
