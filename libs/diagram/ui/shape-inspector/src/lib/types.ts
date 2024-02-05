import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';

export interface DrawChainData {
  drawChain: Shape[];
  expanded: boolean[];
  checksPass: boolean;
}

export interface ExtendedShapeViewData {
  expandedInDrawChain: boolean;
  expandedInGroupView: boolean;
}
