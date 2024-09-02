import { Store } from '@ngrx/store';
import { PageBackgroundContextMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectTransform } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { selectTextEdit } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { selectCopyBuffer } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { combineLatest, map, take } from 'rxjs';

export function getPaste(store: Store, mb: MenuBuilderService, position: Point): CommandItem {
  const disabled$ = combineLatest([
    store.select(selectCopyBuffer),
    store.select(selectTextEdit),
  ]).pipe(
    map(([copyBuffer, textEdit]) => {
      return copyBuffer.length === 0 || textEdit !== null;
    })
  );
  return mb.commandItem({
    label: 'Paste',
    subLabel: 'Ctrl+V',
    disabled$,
    exec: paste(store, position),
  });
}

function paste(store: Store, position: Point): (commandItem: CommandItem) => void {
  return () => {
    combineLatest([
      store.select(selectCopyBuffer),
      store.select(selectTextEdit),
      store.select(selectTransform),
    ])
      .pipe(take(1))
      .subscribe(([copyBuffer, textEdit, transform]) => {
        if (copyBuffer.length > 0 && textEdit === null && transform) {
          const p = inverseTransform(position, transform);
          store.dispatch(
            PageBackgroundContextMenuActions.pasteClick({ textEdit, position: p })
          );
        }
      });
  };
}
