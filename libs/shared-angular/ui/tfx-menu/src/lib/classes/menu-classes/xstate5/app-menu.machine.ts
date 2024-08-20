import { assign, setup } from 'xstate5';
import { ExpandableItem } from '../../menu-item-classes';
import { Menu } from '../menu';
import { AppMenuEvents, XItemEnter } from './tfx-menu.events';

export const appMenuMachine = setup({
  types: {} as {
    context: Menu;
    input: Menu;
    events: AppMenuEvents;
  },
  actions: {
    setActiveItem: assign({
      activeItem: ({ event: ev }) => {
        if ((ev as XItemEnter).item) {
          return (ev as XItemEnter).item;
        }
        return null;
      },
    }),
    clearActiveItem: assign({ activeItem: () => null }),
    setHighlight: ({ context: c }) => {
      if (c.activeItem) {
        c.activeItemIdSubject$.next(c.activeItem.id);
      }
    },
    clearHighlight: ({ context: c }) => {
      c.activeItemIdSubject$.next(Menu.noActiveItem);
    },
    openSubMenu: ({ context: c }) => {
      c.subMenuControlSubject$.next(c.activeItem as ExpandableItem);
    },
    closeSubMenu: ({ context: c }) => {
      c.subMenuControlSubject$.next(null);
    },
  },
  guards: {
    itemNotActiveItem: ({ context: c, event: ev }) => {
      return (ev as XItemEnter).item.id !== c.activeItem?.id;
    },
  },
}).createMachine({
  context: ({ input }) => input,
  id: 'app-menu-machine',
  initial: 'notActive',
  states: {
    notActive: {
      id: 'notActive',
      on: {
        'item.enter': 'active',
      },
    },
    active: {
      entry: ['setActiveItem', 'setHighlight'],
      exit: ['clearHighlight', 'clearActiveItem'],
      initial: 'notExpanded',
      states: {
        notExpanded: {
          on: {
            'item.leave': '#notActive',
            'item.click': 'expanded',
          },
        },
        expanded: {
          entry: ['setActiveItem', 'setHighlight', 'openSubMenu'],
          exit: ['closeSubMenu'],
          on: {
            'item.click': 'notExpanded',
            'item.enter': {
              target: 'expanded',
              guard: 'itemNotActiveItem',
              reenter: true,
            },
            'backdrop.click': '#notActive',
            'command.execute': '#notActive',
          },
        },
      },
    },
  },
});
