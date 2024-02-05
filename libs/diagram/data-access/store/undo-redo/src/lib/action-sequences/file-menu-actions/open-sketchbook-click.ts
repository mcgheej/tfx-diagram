import {
  FileMenuActions,
  SketchbookEffectsActions,
  TransformEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { ActionSequence, ActionSequenceWaypoint } from '../../temp';

const OPEN_CANCEL = 'openCancel';
const OPEN_ERROR = 'openError';
const TRANSFORM_CHANGE_1 = 'transformChange1';
const TRANSFORM_CHANGE_2 = 'transformChange2';

const initialWaypoint: ActionSequenceWaypoint = {
  id: FileMenuActions.openSketchbookClick.type,
  transitions: [
    {
      actionType: SketchbookEffectsActions.openCancel.type,
      waypointId: OPEN_CANCEL,
    },
    {
      actionType: SketchbookEffectsActions.openError.type,
      waypointId: OPEN_ERROR,
    },
    {
      actionType: TransformEffectsActions.transformChange.type,
      waypointId: TRANSFORM_CHANGE_1,
    },
  ],
};

const openCancelWaypoint: ActionSequenceWaypoint = {
  id: OPEN_CANCEL,
  transitions: [],
};

const openErrorWaypoint: ActionSequenceWaypoint = {
  id: OPEN_ERROR,
  transitions: [],
};

const transformChange1Waypoint: ActionSequenceWaypoint = {
  id: TRANSFORM_CHANGE_1,
  transitions: [
    {
      actionType: TransformEffectsActions.transformChange.type,
      waypointId: TRANSFORM_CHANGE_2,
    },
  ],
};

const transformChange2Waypoint: ActionSequenceWaypoint = {
  id: TRANSFORM_CHANGE_2,
  transitions: [],
};

export const openSketchbookCreateSequence: ActionSequence = {
  triggerActionType: FileMenuActions.openSketchbookClick.type,
  waypoints: {
    [FileMenuActions.openSketchbookClick.type]: initialWaypoint,
    [OPEN_CANCEL]: openCancelWaypoint,
    [OPEN_ERROR]: openErrorWaypoint,
    [TRANSFORM_CHANGE_1]: transformChange1Waypoint,
    [TRANSFORM_CHANGE_2]: transformChange2Waypoint,
  },
};
