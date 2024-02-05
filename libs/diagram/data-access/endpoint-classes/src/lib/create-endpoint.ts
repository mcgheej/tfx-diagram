import { Endpoint } from './endpoint';
import { EndpointStyles } from './endpoint-styles';
import { StandardArrow } from './standard-arrow';

export const createEndpoint = (endpointStyle: EndpointStyles): Endpoint | null => {
  switch (endpointStyle) {
    case 'standard-arrow': {
      return new StandardArrow();
    }
  }

  return null;
};
