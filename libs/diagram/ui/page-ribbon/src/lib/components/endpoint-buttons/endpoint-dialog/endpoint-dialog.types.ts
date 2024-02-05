import { Endpoint } from '@tfx-diagram/diagram/data-access/endpoint-classes';

export interface EndpointDialogData {
  endpoint: Endpoint | null;
  end: 'start' | 'finish';
}
