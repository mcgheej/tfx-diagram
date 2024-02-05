import { FontProps } from '@tfx-diagram/electron-renderer-web/shared-types';

export type TextOptionsDialogDataProps = Pick<FontProps, 'alignment' | 'mmPadding'>;

export type TextOptionsDialogData = Partial<TextOptionsDialogDataProps>;
