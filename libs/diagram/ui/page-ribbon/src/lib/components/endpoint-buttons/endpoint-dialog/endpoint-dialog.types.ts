import { Endpoint } from '@tfx-diagram/diagram/data-access/shape-classes';

export interface EndpointDialogData {
  endpoint: Endpoint | null;
  end: 'start' | 'finish';
}
