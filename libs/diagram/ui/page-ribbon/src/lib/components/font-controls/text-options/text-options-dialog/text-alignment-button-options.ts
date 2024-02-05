import { Alignment } from '@tfx-diagram/electron-renderer-web/shared-types';

export interface TextAlignmentButtonConfig {
  iconName: string;
  description: string;
  svg: boolean;
  alignment: Alignment;
}

export const alignmentButtonConfigs: TextAlignmentButtonConfig[] = [
  {
    iconName: 'svg_align_top_left',
    description: 'top, left',
    svg: true,
    alignment: { horizontal: 'left', vertical: 'top' },
  },
  {
    iconName: 'svg_align_top_center',
    description: 'top, centre',
    svg: true,
    alignment: { horizontal: 'center', vertical: 'top' },
  },
  {
    iconName: 'svg_align_top_right',
    description: 'top, right',
    svg: true,
    alignment: { horizontal: 'right', vertical: 'top' },
  },
  {
    iconName: 'svg_align_center_left',
    description: 'centre, left',
    svg: true,
    alignment: { horizontal: 'left', vertical: 'center' },
  },
  {
    iconName: 'svg_align_center_center',
    description: 'centre, centre',
    svg: true,
    alignment: { horizontal: 'center', vertical: 'center' },
  },
  {
    iconName: 'svg_align_center_right',
    description: 'centre, right',
    svg: true,
    alignment: { horizontal: 'right', vertical: 'center' },
  },
  {
    iconName: 'svg_align_bottom_left',
    description: 'bottom, left',
    svg: true,
    alignment: { horizontal: 'left', vertical: 'bottom' },
  },
  {
    iconName: 'svg_align_bottom_center',
    description: 'bottom, centre',
    svg: true,
    alignment: { horizontal: 'center', vertical: 'bottom' },
  },
  {
    iconName: 'svg_align_bottom_right',
    description: 'bottom, right',
    svg: true,
    alignment: { horizontal: 'right', vertical: 'bottom' },
  },
];
