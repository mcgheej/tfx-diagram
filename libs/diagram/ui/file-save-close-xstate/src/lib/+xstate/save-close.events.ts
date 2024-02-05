export class Saved {
  readonly type = 'SAVED';
}

export class Modified {
  readonly type = 'MODIFIED';
}

export class Closed {
  readonly type = 'CLOSED';
}

export class Closing {
  readonly type = 'CLOSING';
}

export class EmptyPath {
  readonly type = 'EMPTY_PATH';
}

export class PathDefined {
  readonly type = 'Path_DEFINED';
}

export type SaveCloseEvents =
  | Saved
  | Modified
  | Closed
  | Closing
  | EmptyPath
  | PathDefined;
