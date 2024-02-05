import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  createEndpoint,
  Endpoint,
  EndpointStyles,
  ENDPOINT_STYLES,
} from '@tfx-diagram/diagram/data-access/endpoint-classes';
import { Size } from 'electron';
import { EndpointDialogData } from './endpoint-dialog.types';

@Component({
  templateUrl: './endpoint-dialog.component.html',
  styleUrls: ['./endpoint-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndpointDialogComponent implements OnInit {
  endpoints: Array<Endpoint | null> = [];

  constructor(
    private changeDetect: ChangeDetectorRef,
    private dialogRef: MatDialogRef<EndpointDialogComponent, EndpointStyles>,
    @Inject(MAT_DIALOG_DATA) public data: EndpointDialogData
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < ENDPOINT_STYLES.length; i++) {
      this.endpoints.push(createEndpoint(ENDPOINT_STYLES[i]));
    }
  }

  onCanvasSize(size: Size, el: HTMLCanvasElement) {
    el.width = size.width;
    el.height = size.height;
    this.changeDetect.detectChanges();
  }

  onEndpointClick(endpoint: Endpoint | null) {
    if (endpoint) {
      this.dialogRef.close(endpoint.endpointType);
    } else {
      this.dialogRef.close('none');
    }
  }
}
