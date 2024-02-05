/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { assign, interpret, Machine } from 'xstate';
import { ExpandableItem } from '../../menu-item-classes/expandable-item';
import { AppMenu } from '../app-menu';
import { Menu } from '../menu';
import { AppMenuEvent, XEnterItemEvent } from './events.xstate';

export interface AppMenuStateSchema {
  states: {
    notActive: {};
    active: {
      states: {
        notExpanded: {};
        expanded: {};
      };
    };
  };
}

export function getService(id: string, context: AppMenu) {
  return interpret(
    Machine<AppMenu, AppMenuStateSchema, AppMenuEvent>(
      {
        id,
        context,
        initial: 'notActive',
        states: {
          notActive: {
            id: 'notActive',
            on: {
              ENTER_ITEM: 'active',
            },
          },
          active: {
            entry: ['setActiveItem', 'setHighlight'],
            exit: ['clearHighlight', 'clearActiveItem'],
            initial: 'notExpanded',
            states: {
              notExpanded: {
                on: {
                  LEAVE_ITEM: '#notActive',
                  CLICK_ITEM: 'expanded',
                },
              },
              expanded: {
                entry: ['setActiveItem', 'setHighlight', 'openSubMenu'],
                exit: 'closeSubMenu',
                on: {
                  CLICK_ITEM: 'notExpanded',
                  ENTER_ITEM: {
                    target: 'expanded',
                    cond: 'itemNotActiveItem',
                  },
                  CLICK_BACKDROP: '#notActive',
                  EXECUTE_COMMAND: '#notActive',
                },
              },
            },
          },
        },
      },
      {
        guards: {
          itemNotActiveItem: (context, event) => {
            return (event as XEnterItemEvent).item.id !== context.activeItem?.id;
          },
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
