import { Endpoint } from '@tfx-diagram/diagram-data-access-shape-base-class';

export interface EndpointDialogData {
  endpoint: Endpoint | null;
  end: 'start' | 'finish';
}
