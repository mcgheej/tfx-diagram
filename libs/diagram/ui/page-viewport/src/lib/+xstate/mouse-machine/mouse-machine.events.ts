export class DoubleClick {
  readonly type = 'DOUBLE_CLICK';
}

export class LeftButtonDown {
  readonly type = 'LEFT_BUTTON_DOWN';
  constructor(public x: number, public y: number) {}
}

export class CtrlLeftButtonDown {
  readonly type = 'CTRL_LEFT_BUTTON_DOWN';
}

export class LeftButtonUp {
  readonly type = 'LEFT_BUTTON_UP';
}

export class MouseMove {
  readonly type = 'MOUSE_MOVE';
  constructor(public x: number, public y: number, public shapeIdUnderMouse: string) {}
}

export type MouseMachineEvents =
  | DoubleClick
  | LeftButtonDown
  | CtrlLeftButtonDown
  | LeftButtonUp
  | MouseMove;
