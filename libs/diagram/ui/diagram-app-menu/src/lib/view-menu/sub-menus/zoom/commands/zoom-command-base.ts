import { Store } from '@ngrx/store';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { ZoomSelectType } from '@tfx-diagram/diagram/ui/zoom-control';
import { CommandItem } from '@tfx-diagram/shared-angular/ui/tfx-menu';

export abstract class ZoomCommandBase {
  constructor(protected store: Store) {}

  protected execZoomCommand(value: ZoomSelectType): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.zoomChange({ zoomSelected: value }));
    };
  }
}
