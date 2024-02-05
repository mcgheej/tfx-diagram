import { Store } from '@ngrx/store';
import { SaveCloseMachineActions } from '@tfx-diagram/diagram-data-access-store-actions';

export const startClose = (store: Store): (() => void) => {
  return () => {
    store.dispatch(SaveCloseMachineActions.closeStart());
  };
};
