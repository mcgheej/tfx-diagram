export interface MenuOptionsProps {
  itemTextColor: string;
  disabledItemTextColor: string;
  itemBackgroundColor: string;
  itemHighlightColor: string;
  itemGroupSeparatorColor: string;
  fontSizePixels: number;
  outlinedIcons: boolean;
}

export type MenuOptions = Partial<MenuOptionsProps>;
