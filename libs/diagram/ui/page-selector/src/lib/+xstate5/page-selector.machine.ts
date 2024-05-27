import { combineLatest, distinctUntilChanged, fromEvent, interval, map, merge } from 'rxjs';
import { assign, fromObservable, raise, setup } from 'xstate5';
import { TfxPoint } from '../page-selector.types';
import { mousemove$ } from './mousemove.observable';
import { IStateMachineService } from './page-selector-machine.service';
import { PageSelectorContext } from './page-selector.context';
import {
  PageSelectorEvents,
  XMoveComplete,
  XMoveInsertPointChange,
  XMoveMouse,
  XMoveScroll,
  XMoveScrollLeft,
  XMoveScrollRight,
  XPagePagesChange,
  XPageSelectedPageChange,
  XTabViewerOverflowChange,
  XTabViewerScroll,
} from './page-selector.events';

export const pageSelectorMachine = setup({
  actors: {
    scrollEverySecond: fromObservable(({ input }: { input: { scrollIndexDelta: number } }) => {
      return interval(1000).pipe(
        map(() => {
          return {
            type: 'move.scroll',
            scrollIndexDelta: input.scrollIndexDelta,
          } as XMoveScroll;
        })
      );
    }),
    insertPointChange: fromObservable(
      ({ input }: { input: { context: PageSelectorContext } }) => {
        const context = input.context;
        return combineLatest([
          mousemove$.pipe(map((mouseEvent: MouseEvent) => mouseEvent.clientX)),
          (context.stateMachineService as IStateMachineService).insertPoints$,
        ]).pipe(
          map(([mouseX, insertPoints]) => {
            const { insertPoint, insertPointIndex } = getInsertPoint(mouseX, insertPoints);
            // return new MoveInsertPointChangeEvent(insertPoint, insertPointIndex);
            return {
              type: 'move.insertPointChange',
              newInsertPoint: insertPoint,
              newInsertPointIndex: insertPointIndex,
            } as XMoveInsertPointChange;
          }),
          distinctUntilChanged(
            (p: XMoveInsertPointChange, q: XMoveInsertPointChange) =>
              p.newInsertPoint.x === q.newInsertPoint.x
          )
        );
      }
    ),
    trackMouseMove: fromObservable(({ input }: { input: { context: PageSelectorContext } }) => {
      const finished$ = fromEvent(document, 'mouseup').pipe(map(() => 'finished'));
      const context = input.context;
      return merge(
        combineLatest([
          mousemove$.pipe(map((mouseEvent: MouseEvent) => mouseEvent.clientX)),
          (context.stateMachineService as IStateMachineService).insertPoints$,
        ]),
        finished$
      ).pipe(
        map((v: [number, TfxPoint[]] | string) => {
          if (v === 'finished') {
            // return new MoveCompleteEvent();
            return { type: 'move.complete' } as XMoveComplete;
          } else {
            const mouseX = v[0] as number;
            const insertPoints = v[1] as TfxPoint[];
            if (mouseX < insertPoints[0].x) {
              // return new MoveScrollLeftEvent();
              return { type: 'move.scrollLeft' } as XMoveScrollLeft;
            }
            if (mouseX >= insertPoints[insertPoints.length - 1].x) {
              // return new MoveScrollRightEvent();
              return { type: 'move.scrollRight' } as XMoveScrollRight;
            }
            // return new MoveMouseMoveEvent(0);
            return { type: 'move.mouse', x: 0 } as XMoveMouse;
          }
        })
      );
    }),
  },
  types: {} as {
    context: PageSelectorContext;
    input: {
      stateMachineService: IStateMachineService;
    };
    events: PageSelectorEvents;
  },
  actions: {
    pagesChangeAction: assign({
      pages: ({ context, event }) => {
        const ev = event as XPagePagesChange;
        return ev.pages.length > 0 ? ev.pages : context.pages;
      },
    }),
    tabViewerScrollAction: assign({
      scrollIndex: ({ context, event }) =>
        getNewScrollIndex(context, event as XTabViewerScroll),
    }),
    tabViewerOverflowChangeAction: assign({
      tabViewerOverflow: ({ event }) => (event as XTabViewerOverflowChange).overflow,
    }),
    selectedPageChangeAction: assign({
      selectedPageIndex: ({ event }) => (event as XPageSelectedPageChange).selectedPageIndex,
    }),
  },
  guards: {
    singlePageGuard: ({ context, event }) => {
      return event.type === 'page.pagesChange'
        ? event.pages.length === 1
        : context.pages.length === 1;
    },
    multiplePagesGuard: ({ context, event }) => {
      return event.type === 'page.pagesChange'
        ? event.pages.length > 1
        : context.pages.length > 1;
    },
    // Guard associated with the XTabViewerScroll event that passes if
    // the tab viewer has not scrolled (page index 0 is in the first visible
    // position of the tab viewer)
    tabViewerNotScrolledGuard: ({ context, event }) => {
      return event.type === 'tabViewer.scroll'
        ? getNewScrollIndex(context, event) === 0
        : context.scrollIndex === 0;
    },
    // Guard associated with the XTabViewerScroll event that passes if
    // the tab viewer has scrolled (page index 0 not in the first visible
    // position of the tab viewer)
    tabViewerScrolledGuard: ({ context, event }) => {
      return event.type === 'tabViewer.scroll'
        ? getNewScrollIndex(context, event) > 0
        : context.scrollIndex > 0;
    },
    // Guard associated with the xTabViewerOverflowChangedEvent that passes
    // if the tab viewer has not overflowed
    noTabViewerOverflowGuard: ({ context, event }) => {
      return event.type === 'tabViewer.overflowChange'
        ? !event.overflow
        : !context.tabViewerOverflow;
    },
    // Guard associated with the  xTabViewerOverflowChangedEvent that passes
    // if the tab viewer has overflowed
    tabViewerOverflowGuard: ({ context, event }) => {
      return event.type === 'tabViewer.overflowChange'
        ? event.overflow
        : context.tabViewerOverflow;
    },
  },
}).createMachine({
  context: ({ input }) => ({
    pages: [],
    selectedPageIndex: -1,
    scrollIndex: 0,
    insertPointIndex: -1,
    tabViewerOverflow: false,
    stateMachineService: input.stateMachineService,
  }),
  id: 'page-selector',
  type: 'parallel',
  states: {
    viewing: {
      initial: 'noPages',
      states: {
        noPages: {
          always: [
            { target: 'singlePage', guard: 'singlePageGuard' },
            { target: 'multiplePages', guard: 'multiplePagesGuard' },
          ],
          on: {
            'page.pagesChange': { actions: 'pagesChangeAction' },
          },
        },
        singlePage: {
          on: {
            'page.pagesChange': [
              {
                target: 'singlePage',
                guard: 'singlePageGuard',
                actions: 'pagesChangeAction',
                reenter: true,
              },
              {
                target: 'multiplePages',
                guard: 'multiplePagesGuard',
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
                    { target: 'notClipped', guard: 'tabViewerNotScrolledGuard' },
                    { target: 'clipped', guard: 'tabViewerScrolledGuard' },
                  ],
                },
                notClipped: {
                  on: {
                    'tabViewer.scroll': [
                      {
                        target: 'clipped',
                        guard: 'tabViewerScrolledGuard',
                        actions: 'tabViewerScrollAction',
                      },
                      {
                        target: 'notClipped',
                        guard: 'tabViewerNotScrolledGuard',
                        actions: 'tabViewerScrollAction',
                        reenter: true,
                      },
                    ],
                  },
                },
                clipped: {
                  on: {
                    'tabViewer.scroll': [
                      {
                        target: 'clipped',
                        guard: 'tabViewerScrolledGuard',
                        actions: 'tabViewerScrollAction',
                        reenter: true,
                      },
                      {
                        target: 'notClipped',
                        guard: 'tabViewerNotScrolledGuard',
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
                    { target: 'notClipped', guard: 'noTabViewerOverflowGuard' },
                    { target: 'clipped', guard: 'tabViewerOverflowGuard' },
                  ],
                },
                notClipped: {
                  on: {
                    'tabViewer.overflowChange': [
                      {
                        target: 'clipped',
                        guard: 'tabViewerOverflowGuard',
                        actions: 'tabViewerOverflowChangeAction',
                      },
                      {
                        target: 'notClipped',
                        guard: 'noTabViewerOverflowGuard',
                        actions: 'tabViewerOverflowChangeAction',
                        reenter: true,
                      },
                    ],
                  },
                },
                clipped: {
                  on: {
                    'tabViewer.overflowChange': [
                      {
                        target: 'clipped',
                        guard: 'tabViewerOverflowGuard',
                        actions: 'tabViewerOverflowChangeAction',
                        reenter: true,
                      },
                      {
                        target: 'notClipped',
                        guard: 'noTabViewerOverflowGuard',
                        actions: 'tabViewerOverflowChangeAction',
                      },
                    ],
                  },
                },
              },
            },
          },
          on: {
            'page.pagesChange': [
              {
                target: 'singlePage',
                guard: 'singlePageGuard',
                actions: 'pagesChangeAction',
              },
              {
                target: 'multiplePages',
                guard: 'multiplePagesGuard',
                actions: 'pagesChangeAction',
                reenter: true,
              },
            ],
          },
        },
      },
      on: {
        'page.selectedPageChange': {
          actions: 'selectedPageChangeAction',
        },
      },
    },
    moving: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            'move.startDelay': {
              target: 'delay',
              guard: 'multiplePagesGuard',
            },
          },
        },
        delay: {
          after: {
            500: 'tracking',
          },
          on: {
            'move.cancel': 'idle',
          },
        },
        tracking: {
          exit: ({ context }) => context.stateMachineService.hideIndicator(),
          initial: 'active',
          invoke: [
            {
              src: 'trackMouseMove',
              input: ({ context }) => ({ context }),
            },
            {
              src: 'insertPointChange',
              input: ({ context }) => ({ context }),
            },
          ],
          states: {
            active: {
              on: {
                'move.scrollLeft': {
                  target: 'scrollLeft',
                  guard: 'tabViewerScrolledGuard',
                },
                'move.scrollRight': {
                  target: 'scrollRight',
                  guard: 'tabViewerOverflowGuard',
                },
              },
            },
            scrollLeft: {
              entry: raise({ type: 'move.scroll', scrollIndexDelta: -1 }),
              invoke: {
                id: 'scroll-left-every-second',
                src: 'scrollEverySecond',
                input: { scrollIndexDelta: -1 },
              },
              always: { target: 'active', guard: 'tabViewerNotScrolledGuard' },
              on: {
                'move.scroll': {
                  guard: 'tabViewerScrolledGuard',
                  actions: 'tabViewerScrollAction',
                },
                'move.mouse': 'active',
              },
            },
            scrollRight: {
              entry: raise({ type: 'move.scroll', scrollIndexDelta: 1 }),
              invoke: {
                id: 'scroll-right-every-second',
                src: 'scrollEverySecond',
                input: { scrollIndexDelta: 1 },
              },
              always: { target: 'active', guard: 'noTabViewerOverflowGuard' },
              on: {
                'move.scroll': {
                  guard: 'tabViewerOverflowGuard',
                  actions: 'tabViewerScrollAction',
                },
                'move.mouse': 'active',
              },
            },
          },
          on: {
            'move.complete': 'idle',
            'move.insertPointChange': {
              actions: [
                ({ context, event }) => {
                  const ev = event as XMoveInsertPointChange;
                  context.stateMachineService.showIndicator(ev.newInsertPoint);
                },
                assign({
                  insertPointIndex: ({ event }) => {
                    return event.newInsertPointIndex;
                  },
                }),
              ],
            },
          },
        },
      },
    },
  },
});

const getNewScrollIndex = (context: PageSelectorContext, event: XTabViewerScroll) => {
  let newScrollIndex = context.scrollIndex + event.scrollIndexDelta;
  if (newScrollIndex < 0) {
    newScrollIndex = 0;
  } else if (newScrollIndex > context.pages.length - 1) {
    newScrollIndex = context.pages.length - 1;
  }
  return newScrollIndex;
};

const getInsertPoint = (x: number, insertPoints: TfxPoint[]) => {
  let pos = 0;
  for (let i = insertPoints.length - 1; i >= 0; i--) {
    if (x >= insertPoints[i].x) {
      pos = i;
      break;
    }
  }
  return {
    insertPoint: { x: insertPoints[pos].x, y: insertPoints[pos].y },
    insertPointIndex: pos,
  };
};
