export interface ActionSequenceTransition {
  actionType: string;
  waypointId: string;
}

export interface ActionSequenceWaypoint {
  id: string;
  transitions: ActionSequenceTransition[];
  // exec function(s) here
}

export interface ActionSequence {
  triggerActionType: string;
  waypoints: { [id: string]: ActionSequenceWaypoint };
}

export type ActionSequences = { [id: string]: ActionSequence };
