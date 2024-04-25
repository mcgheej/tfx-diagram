import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { EndpointButtonsServiceActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  createEndpoint,
  Endpoint,
  EndpointStyles,
} from '@tfx-diagram/diagram/data-access/endpoint-classes';
import { EndpointDialogComponent } from './endpoint-dialog/endpoint-dialog.component';
import { EndpointDialogData } from './endpoint-dialog/endpoint-dialog.types';

@Injectable({ providedIn: 'root' })
export class EndpointButtonsService {
  constructor(private dialog: MatDialog, private store: Store) {}

  openEndpointDialog(el: HTMLElement, endpoint: Endpoint | null, end: 'start' | 'finish') {
    let config: MatDialogConfig<EndpointDialogData> = {
      data: { endpoint, end },
      width: '120px',
      height: '120px',
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
    const dialogRef: MatDialogRef<EndpointDialogComponent, EndpointStyles> = this.dialog.open(
      EndpointDialogComponent,
      config
    );
    dialogRef.afterClosed().subscribe((selectedEndpointStyle) => {
      this.store.dispatch(EndpointButtonsServiceActions.endpointDialogClosed());
      if (selectedEndpointStyle) {
        if (end === 'start') {
          this.store.dispatch(
            EndpointButtonsServiceActions.startEndpointChange({
              endpoint: createEndpoint(selectedEndpointStyle),
            })
          );
        } else {
          this.store.dispatch(
            EndpointButtonsServiceActions.finishEndpointChange({
              endpoint: createEndpoint(selectedEndpointStyle),
            })
          );
        }
      }
    });
  }
}
