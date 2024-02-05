import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tfx-no-color',
  template: ` <p>no-color works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoColorComponent {}
