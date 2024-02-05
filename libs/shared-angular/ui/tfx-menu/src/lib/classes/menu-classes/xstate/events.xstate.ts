import { MenuItem } from '../../menu-item-classes';

export type XEnterItemEvent = { type: 'ENTER_ITEM'; item: MenuItem };
export type XLeaveItemEvent = { type: 'LEAVE_ITEM' };
export type XClickItemEvent = { type: 'CLICK_ITEM'; item: MenuItem };
export type XClickBackdrop = { type: 'CLICK_BACKDROP' };
export type XExecuteCommand = { type: 'EXECUTE_COMMAND' };

export type AppMenuEvent =
  | XEnterItemEvent
  | XLeaveItemEvent
  | XClickItemEvent
  | XClickBackdrop
  | XExecuteCommand;

export type XOverSubMenu = { type: 'OVER_SUB_MENU' };

export type PopupMenuEvent =
  | XEnterItemEvent
  | XLeaveItemEvent
  | XOverSubMenu
  | XClickBackdrop
  | XExecuteCommand;
