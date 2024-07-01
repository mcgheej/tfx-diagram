import { SolidCircle } from './solid-circle';

export class SolidSmallCircle extends SolidCircle {
  constructor() {
    super(0.75);
    this.endpointType = 'solid-s-circle';
  }

  copy(): SolidSmallCircle {
    return new SolidSmallCircle();
  }
}
