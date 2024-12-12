import { ShapeCategory } from '../../../types';
import { DrawableShape } from '../drawable-shape';

export abstract class BasicShape extends DrawableShape {
  override category(): ShapeCategory {
    return 'basic-shape';
  }
}
