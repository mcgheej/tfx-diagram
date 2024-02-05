import { Store } from '@ngrx/store';
import { MouseMachineActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { assign, AssignAction } from 'xstate';
import { MouseMachineEvents } from '../mouse-machine.events';
import { MouseMachineContext } from '../mouse-machine.schema';

export const dragStart = (
  store: Store
): AssignAction<MouseMachineContext, MouseMachineEvents> => {
  return assign<MouseMachineContext, MouseMachineEvents>((context) => {
    store.dispatch(MouseMachineActions.dragStart({ mousePos: { ...context.mousePos } }));
    return {
      mousePos: context.mousePos,
    };
  });
};
