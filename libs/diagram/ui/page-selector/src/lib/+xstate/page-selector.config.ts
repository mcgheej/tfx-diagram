import { interval, map } from 'rxjs';
import { assign, MachineConfig, send } from 'xstate';
import {
  MoveInsertPointChangeEvent,
  MoveScrollEvent,
  PageSelectorEvents,
} from './page-selector.events';
import { PageSelectorContext, PageSelectorSchema } from './page-selector.schema';
import { insertPointChange } from './services/insert-point-change';
import { trackMouseMove } from './services/track-mouse-move';

export const pageSelectorContext: PageSelectorContext = {
  pages: [],
  selectedPageIndex: -1,
  scrollIndex: 0,
  insertPointIndex: -1,
  tabViewerOverflow: false,
  stateMachineService: null,
};

export const pageSelectorConfig = (): MachineConfig<
  PageSelectorContext,
  PageSelectorSchema,
  PageSelectorEvents
> => {
  return {
    id: 'page-selector',
    type: 'parallel',
    states: {
      viewing: {
        initial: 'noPages',
        states: {
          noPages: {
            always: [
              { target: 'singlePage', cond: 'singlePageGuard' },
              { target: 'multiplePages', cond: 'multiplePagesGuard' },
            ],
            on: {
              PAGES_CHANGE_EVENT: { actions: 'pagesChangeAction' },
            },
          },
          singlePage: {
            on: {
              PAGES_CHANGE_EVENT: [
                {
                  target: 'singlePage',
                  cond: 'singlePageGuard',
                  actions: 'pagesChangeAction',
                },
                {
                  target: 'multiplePages',
                  cond: 'multiplePagesGuard',
                  actions: 'pagesChangeAction',
                },
              ],
            },
          },
          multiplePages: {
            type: 'parallel',
            states: {
              leftTabViewSide: {
                initial: 'unknown',
                states: {
                  unknown: {
                    always: [
                      { target: 'notClipped', cond: 'tabViewerNotScrolledGuard' },
                      { target: 'clipped', cond: 'tabViewerScrolledGuard' },
                    ],
                  },
                  notClipped: {
                    on: {
                      TAB_VIEWER_SCROLL_EVENT: [
                        {
                          target: 'clipped',
                          cond: 'tabViewerScrolledGuard',
                          actions: 'tabViewerScrollAction',
                        },
                        {
                          target: 'notClipped',
                          cond: 'tabViewerNotScrolledGuard',
                          actions: 'tabViewerScrollAction',
                        },
                      ],
                    },
                  },
                  clipped: {
                    on: {
                      TAB_VIEWER_SCROLL_EVENT: [
                        {
                          target: 'clipped',
                          cond: 'tabViewerScrolledGuard',
                          actions: 'tabViewerScrollAction',
                        },
                        {
                          target: 'notClipped',
                          cond: 'tabViewerNotScrolledGuard',
                          actions: 'tabViewerScrollAction',
                        },
                      ],
                    },
                  },
                },
              },
              rightTabViewSide: {
                initial: 'unknown',
                states: {
                  unknown: {
                    always: [
                      { target: 'notClipped', cond: 'noTabViewerOverflowGuard' },
                      { target: 'clipped', cond: 'tabViewerOverflowGuard' },
                    ],
                  },
                  notClipped: {
                    on: {
                      TAB_VIEWER_OVERFLOW_CHANGE_EVENT: [
                        {
                          target: 'clipped',
                          cond: 'tabViewerOverflowGuard',
                          actions: 'tabViewerOverflowChangeAction',
                        },
                        {
                          target: 'notClipped',
                          cond: 'noTabViewerOverflowGuard',
                          actions: 'tabViewerOverflowChangeAction',
                        },
                      ],
                    },
                  },
                  clipped: {
                    on: {
                      TAB_VIEWER_OVERFLOW_CHANGE_EVENT: [
                        {
                          target: 'clipped',
                          cond: 'tabViewerOverflowGuard',
                          actions: 'tabViewerOverflowChangeAction',
                        },
                        {
                          target: 'notClipped',
                          cond: 'noTabViewerOverflowGuard',
                          actions: 'tabViewerOverflowChangeAction',
                        },
                      ],
                    },
                  },
                },
              },
            },
            on: {
              PAGES_CHANGE_EVENT: [
                {
                  target: 'singlePage',
                  cond: 'singlePageGuard',
                  actions: 'pagesChangeAction',
                },
                {
                  target: 'multiplePages',
                  cond: 'multiplePagesGuard',
                  actions: 'pagesChangeAction',
                },
              ],
            },
          },
        },
        on: {
          SELECTED_PAGE_CHANGE_EVENT: {
            internal: true,
            actions: ['selectedPageChangedAction'],
          },
        },
      },
      moving: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              MOVE_START_DELAY_EVENT: {
                target: 'delay',
                cond: 'multiplePagesGuard',
              },
            },
          },
          delay: {
            after: {
              500: 'tracking',
            },
            on: {
              MOVE_CANCEL_EVENT: 'idle',
            },
          },
          tracking: {
            exit: [(context) => context.stateMachineService?.hideIndicator()],
            initial: 'active',
            invoke: [
              {
                src: trackMouseMove,
              },
              {
                src: insertPointChange,
              },
            ],
            states: {
              active: {
                on: {
                  MOVE_SCROLL_LEFT_EVENT: {
                    target: 'scrollLeft',
                    cond: 'tabViewerScrolledGuard',
                  },
                  MOVE_SCROLL_RIGHT_EVENT: {
                    target: 'scrollRight',
                    cond: 'tabViewerOverflowGuard',
                  },
                },
              },
              scrollLeft: {
                entry: send(new MoveScrollEvent(-1)),
                invoke: {
                  src: () =>
                    interval(1000).pipe(
                      map(() => {
                        return new MoveScrollEvent(-1);
                      })
                    ),
                },
                always: [{ target: 'active', cond: 'tabViewerNotScrolledGuard' }],
                on: {
                  MOVE_SCROLL_EVENT: {
                    internal: true,
                    cond: 'tabViewerScrolledGuard',
                    actions: 'tabViewerScrollAction',
                  },
                  MOVE_MOUSE_MOVE_EVENT: 'active',
                },
              },
              scrollRight: {
                entry: send(new MoveScrollEvent(1)),
                invoke: {
                  src: () =>
                    interval(1000).pipe(
                      map(() => {
                        return new MoveScrollEvent(1);
                      })
                    ),
                },
                always: [{ target: 'active', cond: 'noTabViewerOverflowGuard' }],
                on: {
                  MOVE_SCROLL_EVENT: {
                    internal: true,
                    cond: 'tabViewerOverflowGuard',
                    actions: 'tabViewerScrollAction',
                  },
                  MOVE_MOUSE_MOVE_EVENT: 'active',
                },
              },
            },
            on: {
              MOVE_COMPLETE_EVENT: 'idle',
              MOVE_INSERT_POINT_CHANGE_EVENT: {
                internal: true,
                actions: [
                  (context: PageSelectorContext, event: MoveInsertPointChangeEvent) =>
                    context.stateMachineService?.showIndicator(event.newInsertPoint),
                  assign((context: PageSelectorContext, event) => {
                    return {
                      insertPointIndex: event.newInsertPointIndex,
                    };
                  }),
                ],
              },
            },
          },
        },
      },
    },
  };
};
