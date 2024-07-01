import { SolidCircle } from './solid-circle';

export class SolidMediumCircle extends SolidCircle {
  constructor() {
    super(1);
    this.endpointType = 'solid-m-circle';
  }

  copy(): SolidMediumCircle {
    return new SolidMediumCircle();
  }
}
