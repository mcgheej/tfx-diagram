import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { IconButtonConfig } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';

@Component({
  selector: 'tfx-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlButtonsComponent implements OnChanges {
  @Input() controlButtonConfigs: IconButtonConfig[] = [];
  @Output() buttonClick = new EventEmitter<number>();

  controlButtonsStyles!: { [klass: string]: string | number };

  ngOnChanges() {
    this.controlButtonsStyles = {
      'height.%': 100,
      display: 'grid',
      gridTemplateColumns: `repeat(${this.controlButtonConfigs.length}, 36px)`,
    };
  }

  onClick(index: number) {
    this.buttonClick.emit(index);
  }
}
