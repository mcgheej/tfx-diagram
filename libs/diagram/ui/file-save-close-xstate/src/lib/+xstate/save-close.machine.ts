import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { setup } from 'xstate5';
import { openDialog } from './actions/open-dialog.action';
import { startClose } from './actions/start-close.action';
import { SaveCloseContext } from './save-close.context';
import { SaveCloseEvents } from './save-close.events';

export const saveCloseMachine = setup({
  types: {} as {
    context: SaveCloseContext;
    input: {
      store: Store;
      dialog: MatDialog;
    };
    events: SaveCloseEvents;
  },
  actions: { openDialog, startClose },
}).createMachine({
  context: ({ input }) => ({
    store: input.store,
    dialog: input.dialog,
  }),
  id: 'save-close-file',
  initial: 'initialState',
  states: {
    initialState: {
      on: {
        saved: 'closing',
        modified: 'saving',
        closed: 'closed',
      },
    },
    saving: {
      entry: [
        {
          type: 'openDialog',
          params: ({ context }) => ({
            store: context.store,
            dialog: context.dialog,
          }),
        },
      ],
      on: {
        closing: 'closing',
        saved: 'closing',
        modified: 'cancelled',
      },
    },
    closing: {
      entry: [
        {
          type: 'startClose',
          params: ({ context }) => ({
            store: context.store,
          }),
        },
      ],
      on: {
        closed: 'closed',
      },
    },
    closed: {},
    cancelled: {},
  },
});
