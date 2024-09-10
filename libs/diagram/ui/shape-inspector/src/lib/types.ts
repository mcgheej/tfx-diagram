import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';

export interface DrawChainData {
  drawChain: Shape[];
  expanded: boolean[];
  checksPass: boolean;
}

export interface ExtendedShapeViewData {
  expandedInDrawChain: boolean;
  expandedInGroupView: boolean;
}
