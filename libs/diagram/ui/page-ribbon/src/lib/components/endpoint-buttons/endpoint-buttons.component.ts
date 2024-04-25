import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Endpoint } from '@tfx-diagram/diagram/data-access/endpoint-classes';
import { EndpointButtonsService } from './endpoint-buttons.service';

@Component({
  selector: 'tfx-endpoint-buttons',
  template: `
    <div class="endpoint-buttons">
      <tfx-start-endpoint-button
        #startEndpointButton
        [endpoint]="startEndpoint"
        (buttonClick)="onStartEndpointButtonClick()"
      ></tfx-start-endpoint-button>
      <tfx-finish-endpoint-button
        #finishEndpointButton
        [endpoint]="finishEndpoint"
        (buttonClick)="onFinishEndpointButtonClick()"
      ></tfx-finish-endpoint-button>
    </div>
  `,
  styles: [
    `
           .endpoint-buttons {
             border-right: 1px solid #dfe3e8;
             height: 100%;
             width: 120px;
             display: grid;
             grid-template-columns: 1fr 1fr;
           }
         `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndpointButtonsComponent {
  @Input() startEndpoint!: Endpoint | null;
  @Input() finishEndpoint!: Endpoint | null;

  @ViewChild('startEndpointButton', { read: ElementRef })
  startEndpointButton!: ElementRef<HTMLElement>;
  @ViewChild('finishEndpointButton', { read: ElementRef })
  finishEndpointButton!: ElementRef<HTMLElement>;

  constructor(private service: EndpointButtonsService) {}

  onStartEndpointButtonClick() {
    if (this.startEndpointButton) {
      this.service.openEndpointDialog(
        this.startEndpointButton.nativeElement,
        this.startEndpoint,
        'start'
      );
    }
  }

  onFinishEndpointButtonClick() {
    if (this.finishEndpointButton) {
      this.service.openEndpointDialog(
        this.finishEndpointButton.nativeElement,
        this.finishEndpoint,
        'finish'
      );
    }
  }
}
