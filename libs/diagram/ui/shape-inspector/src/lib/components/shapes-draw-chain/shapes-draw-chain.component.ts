import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DrawChainData } from '../../types';

@Component({
  selector: 'tfx-shapes-draw-chain',
  templateUrl: './shapes-draw-chain.component.html',
  styleUrls: ['./shapes-draw-chain.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShapesDrawChainComponent {
  @Input() vm: DrawChainData = { drawChain: [], expanded: [], checksPass: true };
  @Output() toggleExpansion = new EventEmitter<string>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onToggleExpansion(id: string) {
    this.toggleExpansion.emit(id);
  }
}
