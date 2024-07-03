import {
  Endpoint,
  EndpointSizes,
  EndpointStyles,
} from '@tfx-diagram/diagram-data-access-shape-base-class';
import { HollowArrow } from './hollow-arrow';
import { HollowCircle } from './hollow-circle';
import { SolidCircle } from './solid-circle';
import { StandardArrow } from './standard-arrow';

export const createStartEndpoint = (endpointStyle: EndpointStyles): Endpoint | null => {
  const endpoint = createEndpoint(endpointStyle);
  if (endpoint) {
    return createEndpoint(endpointStyle, endpoint.modalStartSize);
  }
  return endpoint;
};

export const createFinishEndpoint = (endpointStyle: EndpointStyles): Endpoint | null => {
  const endpoint = createEndpoint(endpointStyle);
  if (endpoint) {
    return createEndpoint(endpointStyle, endpoint.modalFinishSize);
  }
  return endpoint;
};

export const createEndpoint = (
  endpointStyle: EndpointStyles,
  size?: EndpointSizes
): Endpoint | null => {
  switch (endpointStyle) {
    case 'standard-arrow': {
      return new StandardArrow(
        getSize(
          size ? size : StandardArrow.modalStartSize,
          StandardArrow.availableSizesStandardArrow
        )
      );
    }
    case 'hollow-arrow': {
      return new HollowArrow(
        getSize(size ? size : HollowArrow.modalStartSize, HollowArrow.availableSizesHollowArrow)
      );
    }
    case 'solid-circle': {
      return new SolidCircle(
        getSize(size ? size : SolidCircle.modalStartSize, SolidCircle.availableSizesSolidCircle)
      );
    }
    case 'hollow-circle': {
      return new HollowCircle(
        getSize(
          size ? size : HollowCircle.modalStartSize,
          HollowCircle.availableSizesHollowCircle
        )
      );
    }
  }

  return null;
};

function getSize(size: EndpointSizes, availableSizes: EndpointSizes[]): EndpointSizes {
  if (availableSizes.includes(size)) {
    return size;
  } else if (availableSizes.length > 0) {
    return availableSizes[Math.trunc(availableSizes.length / 2)];
  }
  return 'medium';
}
