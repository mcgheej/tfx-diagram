import { Store } from '@ngrx/store';
import { MouseMachineActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { assign, AssignAction } from 'xstate';
import { MouseMachineEvents, MouseMove } from '../mouse-machine.events';
import { MouseMachineContext } from '../mouse-machine.schema';

export const roamMouseMove = (
  store: Store
): AssignAction<MouseMachineContext, MouseMachineEvents> => {
  return assign<MouseMachineContext, MouseMachineEvents>((context, e) => {
    const event = e as MouseMove;
    if (event.shapeIdUnderMouse !== context.highlightedShapeId) {
      store.dispatch(
        MouseMachineActions.highlightedShapeIdChange({
          id: event.shapeIdUnderMouse,
        })
      );
      return {
        mousePos: { x: event.x, y: event.y },
        shapeIdUnderMouse: event.shapeIdUnderMouse,
        highlightedShapeId: event.shapeIdUnderMouse,
      };
    }
    return {
      mousePos: { x: event.x, y: event.y },
      shapeIdUnderMouse: event.shapeIdUnderMouse,
    };
  });
};
