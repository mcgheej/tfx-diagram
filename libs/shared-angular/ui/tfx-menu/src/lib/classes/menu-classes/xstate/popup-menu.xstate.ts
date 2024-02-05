/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { assign, interpret, Machine } from 'xstate';
import { ExpandableItem } from '../../menu-item-classes';
import { Menu } from '../menu';
import { PopupMenu } from '../popup-menu';
import { PopupMenuEvent, XEnterItemEvent } from './events.xstate';

export interface PopupMenuStateSchema {
  states: {
    noActiveItem: {};
    itemActive: {
      states: {
        activeMenuItem: {};
        activeSubMenuItem: {
          states: {
            waitToOpen: {};
            subMenuVisible: {
              states: {
                preview: {};
                closing: {};
                open: {};
              };
            };
          };
        };
      };
    };
  };
}

export function getService(id: string, context: PopupMenu) {
  return interpret(
    Machine<PopupMenu, PopupMenuStateSchema, PopupMenuEvent>(
      {
        id,
        context,
        initial: 'noActiveItem',
        states: {
          noActiveItem: {
            id: 'noActiveItem',
            on: {
              ENTER_ITEM: 'itemActive',
            },
          },
          itemActive: {
            entry: ['setActiveItem', 'setHighlight'],
            exit: ['clearHighlight', 'clearActiveItem'],
            on: {
              LEAVE_ITEM: 'noActiveItem',
              CLICK_BACKDROP: 'noActiveItem',
              ENTER_ITEM: 'itemActive',
            },
            initial: 'activeMenuItem',
            states: {
              activeMenuItem: {
                always: {
                  target: 'activeSubMenuItem',
                  cond: 'itemIsSubMenuItem',
                },
                on: {
                  EXECUTE_COMMAND: { target: '#noActiveItem' },
                },
              },
              activeSubMenuItem: {
                initial: 'waitToOpen',
                on: {
                  EXECUTE_COMMAND: { target: '#noActiveItem' },
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
                          LEAVE_ITEM: 'closing',
                        },
                      },
                      closing: {
                        entry: 'clearHighlight',
                        exit: 'setHighlight',
                        after: {
                          600: '#noActiveItem',
                        },
                        on: {
                          OVER_SUB_MENU: 'open',
                          ENTER_ITEM: {
                            target: 'preview',
                            cond: 'itemIsActiveItem',
                          },
                        },
                      },
                      open: {
                        on: {
                          ENTER_ITEM: {
                            target: 'preview',
                            cond: 'itemIsActiveItem',
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
      },
      {
        guards: {
          itemIsSubMenuItem: (context) => context.activeItem?.type === 'subMenuItem',
          itemIsActiveItem: (context, event) =>
            (event as XEnterItemEvent).item.id === context.activeItem?.id,
        },
        actions: {
          setActiveItem: assign({
            activeItem: (_, event) => {
              if ((event as XEnterItemEvent).item) {
                return (event as XEnterItemEvent).item;
              }
              return null;
            },
          }),
          clearActiveItem: assign({ activeItem: (_, event) => null }),
          setHighlight: (context) => {
            if (context.activeItem) {
              context.activeItemIdSubject$.next(context.activeItem.id);
            }
          },
          clearHighlight: (context) => {
            context.activeItemIdSubject$.next(Menu.noActiveItem);
          },
          openSubMenu: (context) => {
            context.subMenuControlSubject$.next(context.activeItem as ExpandableItem);
          },
          closeSubMenu: (context) => {
            context.subMenuControlSubject$.next(null);
          },
        },
      }
    )
  );
}
