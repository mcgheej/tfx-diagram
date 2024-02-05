import {
  FileMenuActions,
  TransformEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { ActionSequence, ActionSequenceWaypoint } from '../../temp';

const TRANSFORM_CHANGE_1 = 'transformChange1';
const TRANSFORM_CHANGE_2 = 'transformChange2';

const initialWaypoint: ActionSequenceWaypoint = {
  id: FileMenuActions.newSketchbookCreate.type,
  transitions: [
    {
      actionType: TransformEffectsActions.transformChange.type,
      waypointId: TRANSFORM_CHANGE_1,
    },
  ],
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

export const newSketchbookCreateSequence: ActionSequence = {
  triggerActionType: FileMenuActions.newSketchbookCreate.type,
  waypoints: {
    [FileMenuActions.newSketchbookCreate.type]: initialWaypoint,
    [TRANSFORM_CHANGE_1]: transformChange1Waypoint,
    [TRANSFORM_CHANGE_2]: transformChange2Waypoint,
  },
};
