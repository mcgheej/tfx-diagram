import { Endpoint } from './endpoint';
import { EndpointStyles } from './endpoint-styles';
import { SolidLargeCircle } from './solid-l-circle';
import { SolidMediumCircle } from './solid-m-circle';
import { SolidSmallCircle } from './solid-s-circle';
import { StandardArrow } from './standard-arrow';

export const createEndpoint = (endpointStyle: EndpointStyles): Endpoint | null => {
  switch (endpointStyle) {
    case 'standard-arrow': {
      return new StandardArrow();
    }
    case 'solid-s-circle': {
      return new SolidSmallCircle();
    }
    case 'solid-m-circle': {
      return new SolidMediumCircle();
    }
    case 'solid-l-circle': {
      return new SolidLargeCircle();
    }
  }

  return null;
};
