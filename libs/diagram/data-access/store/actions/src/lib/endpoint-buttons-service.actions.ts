import { createAction, props } from '@ngrx/store';
import { Endpoint } from '@tfx-diagram/diagram/data-access/endpoint-classes';

export const endpointDialogOpening = createAction(
  '[EndpointButtonsService] Endpoint Dialog Opening'
);

export const endpointDialogClosed = createAction(
  '[EndpointButtonsService] Endpoint Dialog Closed'
);

export const startEndpointChange = createAction(
  '[EndpointButtonsService] Start Endpoint Change',
  props<{ endpoint: Endpoint | null }>()
);

export const finishEndpointChange = createAction(
  '[EndpointButtonsService] Finish Endpoint Change',
  props<{ endpoint: Endpoint | null }>()
);
