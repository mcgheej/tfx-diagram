import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ENDPOINT_STYLES,
  Endpoint,
  EndpointSizes,
  EndpointStyles,
  createEndpoint,
  createFinishEndpoint,
  createStartEndpoint,
} from '@tfx-diagram/diagram/data-access/endpoint-classes';
import { Size } from 'electron';
import { EndpointDialogData } from './endpoint-dialog.types';

export interface EndpointDialogResult {
  endpointType: EndpointStyles;
  size: EndpointSizes;
}

@Component({
  templateUrl: './endpoint-dialog.component.html',
  styleUrls: ['./endpoint-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndpointDialogComponent implements OnInit {
  endpoints: Array<Endpoint | null> = [];

  constructor(
    private changeDetect: ChangeDetectorRef,
    private dialogRef: MatDialogRef<EndpointDialogComponent, EndpointDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: EndpointDialogData
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < ENDPOINT_STYLES.length; i++) {
      const style = ENDPOINT_STYLES[i];
      this.endpoints.push(
        this.data.end === 'start' ? createStartEndpoint(style) : createFinishEndpoint(style)
      );
    }
  }

  onCanvasSize(size: Size, el: HTMLCanvasElement) {
    el.width = size.width;
    el.height = size.height;
    this.changeDetect.detectChanges();
  }

  onEndpointClick(endpoint: Endpoint | null) {
    if (endpoint) {
      this.dialogRef.close({
        endpointType: endpoint.endpointType,
        size: endpoint.size,
      } as EndpointDialogResult);
    } else {
      this.dialogRef.close({
        endpointType: 'none',
        size: 'medium',
      } as EndpointDialogResult);
    }
  }

  onSizeChangeClick(i: number) {
    if (this.endpoints[i]) {
      const endpoint = this.endpoints[i] as Endpoint;
      const currentSizeIndex = endpoint.availableSizes.findIndex(
        (size) => size === endpoint.size
      );
      if (currentSizeIndex >= 0) {
        const nAvailableSizes = endpoint.availableSizes.length;
        const newSize = endpoint.availableSizes[(currentSizeIndex + 1) % nAvailableSizes];
        this.endpoints[i] = createEndpoint(endpoint.endpointType, newSize);
      }
    }
  }
}
