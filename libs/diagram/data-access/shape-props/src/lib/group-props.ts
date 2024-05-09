import { PartPartial } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ShapeProps } from './shape-props';

export interface GroupProps extends ShapeProps {
  groupMemberIds: string[];
}

export type GroupConfig = PartPartial<Omit<GroupProps, 'shapeType'>, 'id'>;
