/* eslint-disable @typescript-eslint/ban-types */

import { Observable } from 'rxjs';
import { TfxPoint } from '../page-selector.types';

export interface IStateMachineService {
  insertPoints$: Observable<TfxPoint[]>;
  showIndicator(indicatorPosition: TfxPoint): void;
  hideIndicator(): void;
}

export interface PageSelectorContext {
  pages: string[];
  selectedPageIndex: number;
  scrollIndex: number;
  insertPointIndex: number;
  tabViewerOverflow: boolean;
  stateMachineService: IStateMachineService | null;
}

export interface PageSelectorSchema {
  states: {
    viewing: {
      states: {
        noPages: {};
        singlePage: {};
        multiplePages: {
          states: {
            leftTabViewSide: {
              states: {
                unknown: {};
                notClipped: {};
                clipped: {};
              };
            };
            rightTabViewSide: {
              states: {
                unknown: {};
                notClipped: {};
                clipped: {};
              };
            };
          };
        };
      };
    };
    moving: {
      states: {
        idle: {};
        delay: {};
        tracking: {
          states: {
            active: {};
            scrollLeft: {};
            scrollRight: {};
          };
        };
      };
    };
  };
}
