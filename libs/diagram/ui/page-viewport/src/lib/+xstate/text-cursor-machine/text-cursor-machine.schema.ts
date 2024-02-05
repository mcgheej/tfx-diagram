/* eslint-disable @typescript-eslint/ban-types */

export interface TextCursorMachineContext {
  showCursor: boolean;
}

export interface TextCursorMachineSchema {
  states: {
    visible: {};
    hidden: {};
  };
}
