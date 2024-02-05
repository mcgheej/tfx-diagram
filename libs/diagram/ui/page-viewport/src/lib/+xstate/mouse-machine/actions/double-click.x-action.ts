import { Store } from '@ngrx/store';
import { MouseMachineActions } from '@tfx-diagram/diagram-data-access-store-actions';

export const doubleClick = (store: Store): (() => void) => {
  return () => {
    store.dispatch(MouseMachineActions.doubleClick());
  };
};
