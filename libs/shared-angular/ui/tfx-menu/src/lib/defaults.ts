import { MenuOptionsProps } from './types/menu-options.types';

export const DEFAULT_CHECKBOX_ITEM_VALUE = true;

export const APP_MENU_DEFAULT_OPTIONS: MenuOptionsProps = {
  itemTextColor: '#ffffff',
  disabledItemTextColor: '#aaaaaa',
  itemBackgroundColor: '#008000',
  itemHighlightColor: '#006000',
  itemGroupSeparatorColor: '#aaaaaa',
  fontSizePixels: 13,
  outlinedIcons: false,
};

export const SUB_MENU_DEFAULT_OPTIONS: MenuOptionsProps = {
  itemTextColor: '#212121',
  disabledItemTextColor: '#aaaaaa',
  itemBackgroundColor: '#ffffff',
  itemHighlightColor: '#cccccc',
  itemGroupSeparatorColor: '#aaaaaa',
  fontSizePixels: 13,
  outlinedIcons: false,
};

export const CONTEXT_MENU_DEFAULT_OPTIONS: MenuOptionsProps = {
  itemTextColor: '#212121',
  disabledItemTextColor: '#666666',
  itemBackgroundColor: '#ffffff',
  itemHighlightColor: '#cccccc',
  itemGroupSeparatorColor: '#aaaaaa',
  fontSizePixels: 13,
  outlinedIcons: false,
};
