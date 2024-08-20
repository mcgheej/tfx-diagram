import { assign, setup } from 'xstate5';
import { ExpandableItem } from '../../menu-item-classes';
import { Menu } from '../menu';
import { PopupMenu } from '../popup-menu';
import { PopupMenuEvents, XItemEnter } from './tfx-menu.events';

export const popupMenuMachine = setup({
  types: {} as {
    context: PopupMenu;
    input: PopupMenu;
    events: PopupMenuEvents;
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
    itemIsSubMenuItem: ({ context: c }) => c.activeItem?.type === 'subMenuItem',
    itemIsActiveItem: ({ context: c, event: ev }) =>
      (ev as XItemEnter).item.id === c.activeItem?.id,
  },
}).createMachine({
  context: ({ input }) => input,
  initial: 'noActiveItem',
  states: {
    noActiveItem: {
      id: 'noActiveItem',
      on: {
        'item.enter': 'activeItem',
      },
    },
    activeItem: {
      entry: ['setActiveItem', 'setHighlight'],
      exit: ['clearHighlight', 'clearActiveItem'],
      on: {
        'item.leave': 'noActiveItem',
        'backdrop.click': 'noActiveItem',
        'item.enter': {
          target: 'activeItem',
          reenter: true,
        },
      },
      initial: 'activeMenuItem',
      states: {
        activeMenuItem: {
          always: {
            target: 'activeSubMenuItem',
            guard: 'itemIsSubMenuItem',
          },
          on: {
            'command.execute': '#noActiveItem',
          },
        },
        activeSubMenuItem: {
          initial: 'waitToOpen',
          on: {
            'command.execute': '#noActiveItem',
          },
          states: {
            waitToOpen: {
              after: {
                300: 'subMenuVisible',
              },
            },
            subMenuVisible: {
              entry: ['openSubMenu'],
              exit: ['closeSubMenu'],
              initial: 'preview',
              states: {
                preview: {
                  on: {
                    'item.leave': 'closing',
                  },
                },
                closing: {
                  entry: ['clearHighlight'],
                  exit: ['setHighlight'],
                  after: {
                    600: '#noActiveItem',
                  },
                  on: {
                    'mouse.overSubMenu': 'open',
                    'item.enter': {
                      target: 'preview',
                      guard: 'itemIsActiveItem',
                    },
                  },
                },
                open: {
                  on: {
                    'item.enter': {
                      target: 'preview',
                      guard: 'itemIsActiveItem',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});
