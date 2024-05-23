import { Store } from '@ngrx/store';
import { MouseMachineActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { assign, setup } from 'xstate5';
import { MouseMachineContext } from './mouse-machine.context';
import { LeftButtonDown, MouseMachineEvents, MouseMove } from './mouse-machine.events';

export const mouseMachine = setup({
  types: {} as {
    context: MouseMachineContext;
    input: {
      store: Store;
    };
    events: MouseMachineEvents;
  },
  actions: {
    leftButtonDown: ({ context, event }) => {
      const x = (event as LeftButtonDown).x;
      const y = (event as LeftButtonDown).y;
      context.store.dispatch(MouseMachineActions.leftButtonDown({ x, y }));
    },
    ctrlLeftButtonDown: ({ context }) => {
      context.store.dispatch(MouseMachineActions.ctrlLeftButtonDown());
    },
    roamMouseMove: assign(({ context, event }) => {
      const ev = event as MouseMove;
      if (ev.shapeIdUnderMouse !== context.highlightedShapeId) {
        context.store.dispatch(
          MouseMachineActions.highlightedShapeIdChange({
            id: ev.shapeIdUnderMouse,
          })
        );
        return {
          mousePos: { x: ev.x, y: ev.y },
          shapeIdUnderMouse: ev.shapeIdUnderMouse,
          highlightedShapeId: ev.shapeIdUnderMouse,
        };
      }
      return {
        mousePos: { x: ev.x, y: ev.y },
        shapeIdUnderMouse: ev.shapeIdUnderMouse,
      };
    }),
    doubleClick: ({ context }) => {
      context.store.dispatch(MouseMachineActions.doubleClick());
    },
    dragStart: assign(({ context }) => {
      context.store.dispatch(
        MouseMachineActions.dragStart({ mousePos: { ...context.mousePos } })
      );
      return {
        mousePos: context.mousePos,
      };
    }),
    dragEnd: ({ context }) => {
      context.store.dispatch(MouseMachineActions.dragEnd());
    },
    dragMove: assign(({ context, event }) => {
      const ev = event as MouseMove;
      context.store.dispatch(MouseMachineActions.dragMove({ mousePos: { x: ev.x, y: ev.y } }));
      return {
        mousePos: { x: ev.x, y: ev.y },
        shapeIdUnderMouse: ev.shapeIdUnderMouse,
      };
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsD2BXWYC0yCGAxgBYCWAdmAHQBOqeyAxADZgBmALgELrvupmUIqAO5kA2gAYAuolAAHVLBLsS-WSAAeibABYJlAKwBOAMwB2AIwWDANgBMRgBwSJBgDQgAnomtnKjpz07HSMrM1cAXwiPNEwcfGJyKlp6ZjYuHj4BAnZqJgAREXFpdQUlFTUkTW07Y0NTS2t7Jxd3Lx8DPwDHIJCwyOiQWKxcQlIKGjpGYao0ADcwSRkqsuVVMnUtBDszPxMDayNa6x0zA0cTD28EbDMbQwNWkwkLExsbc0comIwRhPHklM0hxuLx+IIMAAjFgAYSYJAIAGslqVFGtKqAtjoHFdtBZTA8ni83h8zF9BjNRokJhBqHgoAAFMBkCDkKDAjJggToOQolZoiobKpbCzhSjmEJGAwGOw2HQ2O4WXEICzOSj2EJyoyhUUDH5xKkAwR0xnM1lkdkaWDsPDsKh4DhgagACjsLgAlAxKf8ksb6UyWWy+fIBetNogHCZKC9bHcDCYLMEJJd2ttOpREyEdNnHp1at8hr94mNfbT6RzQVlKDzgyBVoLwwhTkZKEY7vYZd1pR9lVZ9JK285njYJNqC96SzSTV6i5R5osSvzymHhYgbInDL4JOEdI5HKqdMqTDoDJQzCFuviDiZTDoooMyKgIHB1BPqWBUcuMdUbs8-MZzCsWwHGcVxlWwOx92jR5XGeV53hMcl9T+SdAXoT90SFTEfDlM9kxOM4zg+OxlXTGxtSOUdtxPc9xyLQ1SxNANzSgDCG1XFVs38IwJHsVxZXlRVlR2RxxQOR5yNzMx8wpeifSnek2JXbCmzbMSLBsaVnHPExzBsYSyXUiSpVcaSDHvCIgA */
  context: ({ input }) => ({
    mousePos: { x: 0, y: 0 },
    shapeIdUnderMouse: '',
    highlightedShapeId: '',
    store: input.store,
  }),
  id: 'mouse-machine',
  initial: 'roam',
  states: {
    roam: {
      on: {
        'leftButton.down': {
          target: 'dragPending',
          actions: 'leftButtonDown',
        },
        'leftButton.ctrlDown': {
          target: 'dragPending',
          actions: 'ctrlLeftButtonDown',
        },
        'mouse.move': {
          target: 'roam',
          actions: 'roamMouseMove',
        },
        'leftButton.doubleClick': {
          target: 'roam',
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
        'leftButton.up': 'roam',
      },
    },
    drag: {
      on: {
        'leftButton.up': {
          target: 'roam',
          actions: 'dragEnd',
        },
        'mouse.move': {
          target: 'drag',
          actions: 'dragMove',
        },
      },
    },
  },
});
