import { SolidCircle } from './solid-circle';

export class SolidLargeCircle extends SolidCircle {
  constructor() {
    super(1.5);
    this.endpointType = 'solid-l-circle';
  }

  copy(): SolidLargeCircle {
    return new SolidLargeCircle();
  }
}
