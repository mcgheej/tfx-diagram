import { InjectionToken } from '@angular/core';
import { PopupMenu } from './classes/menu-classes';

export const POPUP_MENU_DATA = new InjectionToken<PopupMenu>('POPUP_MENU_DATA');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MENU_ITEM_DATA = new InjectionToken<any>('MENU_ITEM_DATA');
