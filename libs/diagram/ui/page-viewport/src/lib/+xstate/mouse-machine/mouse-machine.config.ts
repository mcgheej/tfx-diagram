import { MachineConfig } from 'xstate';
import { MouseMachineEvents } from './mouse-machine.events';
import { MouseMachineContext, MouseMachineSchema } from './mouse-machine.schema';

export const mouseMachineContext: MouseMachineContext = {
  mousePos: { x: 0, y: 0 },
  shapeIdUnderMouse: '',
  highlightedShapeId: '',
};

export const mouseMachineConfig = (): MachineConfig<
  MouseMachineContext,
  MouseMachineSchema,
  MouseMachineEvents
> => {
  return {
    id: 'mouse-machine',
    initial: 'roam',
    states: {
      roam: {
        on: {
          LEFT_BUTTON_DOWN: {
            target: 'dragPending',
            actions: 'leftButtonDown',
          },
          CTRL_LEFT_BUTTON_DOWN: {
            target: 'dragPending',
            actions: 'ctrlLeftButtonDown',
          },
          MOUSE_MOVE: {
            target: 'roam',
            actions: 'roamMouseMove',
          },
          DOUBLE_CLICK: {
            target: 'roam',
            internal: true,
            actions: 'doubleClick',
          },
        },
      },
      dragPending: {
        after: {
          200: {
            target: 'drag',
            actions: 'dragStart',
          },
        },
        on: {
          LEFT_BUTTON_UP: 'roam',
        },
      },
      drag: {
        on: {
          LEFT_BUTTON_UP: {
            target: 'roam',
            actions: 'dragEnd',
          },
          MOUSE_MOVE: {
            target: 'drag',
            actions: 'dragMove',
          },
        },
      },
    },
  };
};
