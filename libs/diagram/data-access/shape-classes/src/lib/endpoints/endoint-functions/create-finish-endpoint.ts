import { Endpoint } from '../endpoint';
import { EndpointStyle } from '../endpoint.types';
import { createEndpoint } from './create-endpoint';

export function createFinishEndpoint(endpointStyle: EndpointStyle): Endpoint | null {
  const endpoint = createEndpoint(endpointStyle);
  if (endpoint) {
    return createEndpoint(endpointStyle, endpoint.modalFinishSize);
  }
  return endpoint;
}
