import { Shape } from './shape';

export abstract class ControlShape extends Shape {
  resizeToBox(): Shape {
    return this.copy({});
  }
  override category(): string {
    return 'control-shape';
  }
}
