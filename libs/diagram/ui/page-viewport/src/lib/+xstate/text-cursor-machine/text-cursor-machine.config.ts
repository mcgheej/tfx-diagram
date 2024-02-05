import { MachineConfig } from 'xstate';
import { TextCursorMachineEvents } from './text-cursor-machine.events';
import {
  TextCursorMachineContext,
  TextCursorMachineSchema,
} from './text-cursor-machine.schema';

export const textCursorMachineContext: TextCursorMachineContext = {
  showCursor: true,
};

export const textCursorMachineConfig = (): MachineConfig<
  TextCursorMachineContext,
  TextCursorMachineSchema,
  TextCursorMachineEvents
> => {
  return {
    id: 'text-cursor-machine',
    initial: 'visible',
    states: {
      visible: {
        entry: 'showCursor',
        on: {
          CURSOR_MOVED: 'visible',
        },
        after: {
          600: 'hidden',
        },
      },
      hidden: {
        entry: 'hideCursor',
        on: {
          CURSOR_MOVED: 'visible',
        },
        after: {
          400: 'visible',
        },
      },
    },
  };
};
