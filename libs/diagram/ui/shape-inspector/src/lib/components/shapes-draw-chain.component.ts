import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DrawChainData } from '../types';

@Component({
  selector: 'tfx-shapes-draw-chain',
  template: `
    <div class="container">
      <div *ngFor="let s of vm.drawChain; index as i">
        <tfx-shape
          [shape]="s"
          [expanded]="vm.expanded[i]"
          (toggleExpansion)="onToggleExpansion(s.id)"
        ></tfx-shape>
      </div>
      <div>Checks pass: {{ vm.checksPass }}</div>
    </div>
  `,
  styles: [
    `
      :host {
        height: 100%;
        width: 100%;
      }

      .container {
        height: 100%;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShapesDrawChainComponent {
  @Input() vm: DrawChainData = { drawChain: [], expanded: [], checksPass: true };
  @Output() toggleExpansion = new EventEmitter<string>();

  onToggleExpansion(id: string) {
    this.toggleExpansion.emit(id);
  }
}
