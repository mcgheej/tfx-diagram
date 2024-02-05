import { Store } from '@ngrx/store';
import { MouseMachineActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { assign, AssignAction } from 'xstate';
import { MouseMachineEvents, MouseMove } from '../mouse-machine.events';
import { MouseMachineContext } from '../mouse-machine.schema';

export const dragMove = (
  store: Store
): AssignAction<MouseMachineContext, MouseMachineEvents> => {
  return assign<MouseMachineContext, MouseMachineEvents>((context, event) => {
    const e = event as MouseMove;
    store.dispatch(MouseMachineActions.dragMove({ mousePos: { x: e.x, y: e.y } }));
    return {
      mousePos: { x: e.x, y: e.y },
      shapeIdUnderMouse: e.shapeIdUnderMouse,
    };
  });
};
