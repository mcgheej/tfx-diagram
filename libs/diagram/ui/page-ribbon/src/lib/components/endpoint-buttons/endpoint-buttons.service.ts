import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { EndpointButtonsServiceActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { createEndpoint } from '@tfx-diagram/diagram/data-access/endpoint-classes';
import { Endpoint } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  EndpointDialogComponent,
  EndpointDialogResult,
} from './endpoint-dialog/endpoint-dialog.component';
import { EndpointDialogData } from './endpoint-dialog/endpoint-dialog.types';

@Injectable({ providedIn: 'root' })
export class EndpointButtonsService {
  constructor(private dialog: MatDialog, private store: Store) {}

  openEndpointDialog(el: HTMLElement, endpoint: Endpoint | null, end: 'start' | 'finish') {
    let config: MatDialogConfig<EndpointDialogData> = {
      data: { endpoint, end },
      width: '180px',
      height: '218px',
      backdropClass: 'tfx-dialog-backdrop-transparent',
    };
    if (el) {
      const { offsetLeft: left, offsetTop: top, offsetHeight: height } = el;
      config = {
        ...config,
        position: {
          left: `${left}px`,
          top: `${top + height}px`,
        },
      };
    }
    this.store.dispatch(EndpointButtonsServiceActions.endpointDialogOpening());
    const dialogRef: MatDialogRef<EndpointDialogComponent, EndpointDialogResult> =
      this.dialog.open(EndpointDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      this.store.dispatch(EndpointButtonsServiceActions.endpointDialogClosed());
      if (result) {
        if (end === 'start') {
          const endpoint = createEndpoint(result.endpointType, result.size);
          if (endpoint) {
            endpoint.modalStartSize = result.size;
          }
          this.store.dispatch(EndpointButtonsServiceActions.startEndpointChange({ endpoint }));
        } else {
          const endpoint = createEndpoint(result.endpointType, result.size);
          if (endpoint) {
            endpoint.modalFinishSize = result.size;
          }
          this.store.dispatch(EndpointButtonsServiceActions.finishEndpointChange({ endpoint }));
        }
      }
    });
  }
}
