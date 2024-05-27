import { IStateMachineService } from './page-selector-machine.service';

export interface PageSelectorContext {
  pages: string[];
  selectedPageIndex: number;
  scrollIndex: number;
  insertPointIndex: number;
  tabViewerOverflow: boolean;
  stateMachineService: IStateMachineService;
}
