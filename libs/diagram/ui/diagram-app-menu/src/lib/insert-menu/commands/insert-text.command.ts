import { Store } from '@ngrx/store';
import { InsertMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectPageWindow } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Rectangle, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { selectFontProps } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { combineLatest, filter, take } from 'rxjs';

export class InsertTextCommand {
  private item = this.mb.commandItem({
    label: 'Insert Text',
    exec: this.insertText(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private insertText(): (commandItem: CommandItem) => void {
    return () => {
      combineLatest([this.store.select(selectPageWindow), this.store.select(selectFontProps)])
        .pipe(
          take(1),
          filter((pageWindow) => pageWindow !== null)
        )
        .subscribe(([pageWindow, textConfig]) => {
          // const rWidth = 30;
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
                strokeStyle: { colorSet: 'empty', ref: '' },
                fillStyle: { colorSet: 'empty', ref: '' },
                textConfig: { ...textConfig, text: 'Text' },
              }),
            })
          );
        });
    };
  }
}
