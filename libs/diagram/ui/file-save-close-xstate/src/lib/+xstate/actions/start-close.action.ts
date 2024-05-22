import { Store } from '@ngrx/store';
import { SaveCloseMachineActions } from '@tfx-diagram/diagram-data-access-store-actions';

export function startClose(_: unknown, params: { store: Store }) {
  params.store.dispatch(SaveCloseMachineActions.closeStart());
}
