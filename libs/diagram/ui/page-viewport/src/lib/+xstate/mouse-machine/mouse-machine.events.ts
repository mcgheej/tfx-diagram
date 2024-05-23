export type LeftButtonDown = { type: 'leftButton.down'; x: number; y: number };
export type LeftButtonDoubleClick = { type: 'leftButton.doubleClick' };
export type LeftButtonCtrlDown = { type: 'leftButton.ctrlDown' };
export type LeftButtonUp = { type: 'leftButton.up' };
export type MouseMove = { type: 'mouse.move'; x: number; y: number; shapeIdUnderMouse: string };

export type MouseMachineEvents =
  | LeftButtonDown
  | LeftButtonDoubleClick
  | LeftButtonCtrlDown
  | LeftButtonUp
  | MouseMove;
