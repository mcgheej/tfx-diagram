import { Store } from '@ngrx/store';
import { MouseMachineActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { LeftButtonDown, MouseMachineEvents } from '../mouse-machine.events';
import { MouseMachineContext } from '../mouse-machine.schema';

export const leftButtonDown = (
  store: Store
): ((context: MouseMachineContext, ev: MouseMachineEvents) => void) => {
  return (context, event) => {
    const x = (event as LeftButtonDown).x;
    const y = (event as LeftButtonDown).y;
    store.dispatch(MouseMachineActions.leftButtonDown({ x, y }));
  };
};
