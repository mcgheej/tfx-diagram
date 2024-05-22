export type SaveCloseEvents =
  | { type: 'saved' }
  | { type: 'modified' }
  | { type: 'closed' }
  | { type: 'closing' }
  | { type: 'emptyPath' }
  | { type: 'pathDefined' };
