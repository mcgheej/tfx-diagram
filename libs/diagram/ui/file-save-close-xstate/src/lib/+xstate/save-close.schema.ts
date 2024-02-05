/* eslint-disable @typescript-eslint/ban-types */

export type SaveCloseContext = Record<string, never>;

export interface SaveCloseSchema {
  states: {
    initialState: {};
    saving: {};
    closing: {};
    closed: {};
    cancelled: {};
  };
}
