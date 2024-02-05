import { MachineConfig } from 'xstate';
import { SaveCloseEvents } from './save-close.events';
import { SaveCloseContext, SaveCloseSchema } from './save-close.schema';

export const saveCloseConfig = (): MachineConfig<
  SaveCloseContext,
  SaveCloseSchema,
  SaveCloseEvents
> => {
  return {
    id: 'save-close-file',
    initial: 'initialState',
    states: {
      initialState: {
        on: {
          SAVED: 'closing',
          MODIFIED: 'saving',
          CLOSED: 'closed',
        },
      },
      saving: {
        entry: 'openDialog',
        on: {
          CLOSING: 'closing',
          SAVED: 'closing',
          MODIFIED: 'cancelled',
        },
      },
      closing: {
        entry: 'startClose',
        on: {
          CLOSED: 'closed',
        },
      },
      closed: {},
      cancelled: {},
    },
  };
};
