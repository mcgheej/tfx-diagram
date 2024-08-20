import { MenuItem } from '../../menu-item-classes';

export type XItemEnter = { type: 'item.enter'; item: MenuItem };
export type XItemLeave = { type: 'item.leave' };
export type XItemClick = { type: 'item.click'; item: MenuItem };
export type XBackdropClick = { type: 'backdrop.click' };
export type XCommandExecute = { type: 'command.execute' };

export type AppMenuEvents =
  | XItemEnter
  | XItemLeave
  | XItemClick
  | XBackdropClick
  | XCommandExecute;

export type XMouseOverSubMenu = { type: 'mouse.overSubMenu' };

export type PopupMenuEvents =
  | XItemEnter
  | XItemLeave
  | XMouseOverSubMenu
  | XBackdropClick
  | XCommandExecute;
