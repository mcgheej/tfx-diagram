import { Endpoint } from '../endpoint';
import { EndpointStyle } from '../endpoint.types';
import { createEndpoint } from './create-endpoint';

export function createStartEndpoint(endpointStyle: EndpointStyle): Endpoint | null {
  const endpoint = createEndpoint(endpointStyle);
  if (endpoint) {
    return createEndpoint(endpointStyle, endpoint.modalStartSize);
  }
  return endpoint;
}
