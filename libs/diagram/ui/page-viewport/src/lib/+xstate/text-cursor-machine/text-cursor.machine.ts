import { assign, setup } from 'xstate5';
import { TextCursorContext } from './text-cursor.context';
import { TextCursorEvents } from './text-cursor.events';

export const textCursorMachine = setup({
  types: {} as {
    context: TextCursorContext;
    input: {
      showCursor: boolean;
    };
    events: TextCursorEvents;
  },
  actions: {
    displayCursor: assign({ showCursor: () => true }),
    hideCursor: assign({ showCursor: () => false }),
  },
}).createMachine({
  context: ({ input }) => ({
    showCursor: input.showCursor,
  }),
  id: 'text-cursor-machine',
  initial: 'visible',
  states: {
    visible: {
      entry: 'displayCursor',
      on: {
        'cursor.moved': {
          target: 'visible',
          reenter: true,
        },
      },
      after: {
        600: 'hidden',
      },
    },
    hidden: {
      entry: 'hideCursor',
      on: {
        'cursor.moved': 'visible',
      },
      after: {
        400: 'visible',
      },
    },
  },
});
