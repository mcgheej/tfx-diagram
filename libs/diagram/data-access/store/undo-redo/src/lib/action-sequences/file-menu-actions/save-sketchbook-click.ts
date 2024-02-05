import {
  FileMenuActions,
  SketchbookEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { ActionSequence, ActionSequenceWaypoint } from '../../temp';

const SAVE_CANCEL = 'saveCancel';
const SAVE_ERROR = 'saveError';
const SAVE_SUCCESS = 'saveSuccess';

const initialWaypoint: ActionSequenceWaypoint = {
  id: FileMenuActions.saveSketchbookClick.type,
  transitions: [
    {
      actionType: SketchbookEffectsActions.saveCancel.type,
      waypointId: SAVE_CANCEL,
    },
    {
      actionType: SketchbookEffectsActions.saveError.type,
      waypointId: SAVE_ERROR,
    },
    {
      actionType: SketchbookEffectsActions.saveSuccess.type,
      waypointId: SAVE_SUCCESS,
    },
  ],
};

const saveCancelWaypoint: ActionSequenceWaypoint = {
  id: SAVE_CANCEL,
  transitions: [],
};

const saveErrorWaypoint: ActionSequenceWaypoint = {
  id: SAVE_ERROR,
  transitions: [],
};

const saveSuccessWaypoint: ActionSequenceWaypoint = {
  id: SAVE_SUCCESS,
  transitions: [],
};

export const saveSketchbookClickSequence: ActionSequence = {
  triggerActionType: FileMenuActions.saveSketchbookClick.type,
  waypoints: {
    [FileMenuActions.saveSketchbookClick.type]: initialWaypoint,
    [SAVE_CANCEL]: saveCancelWaypoint,
    [SAVE_ERROR]: saveErrorWaypoint,
    [SAVE_SUCCESS]: saveSuccessWaypoint,
  },
};
