import {
  Endpoint,
  EndpointSize,
  EndpointStyle,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { HalfCircle } from './half-circle';
import { HollowArrow } from './hollow-arrow';
import { HollowCircle } from './hollow-circle';
import { HollowDiamond } from './hollow-diamond';
import { SolidCircle } from './solid-circle';
import { SolidDiamond } from './solid-diamond';
import { StandardArrow } from './standard-arrow';

export function createStartEndpoint(endpointStyle: EndpointStyle): Endpoint | null {
  const endpoint = createEndpoint(endpointStyle);
  if (endpoint) {
    return createEndpoint(endpointStyle, endpoint.modalStartSize);
  }
  return endpoint;
}

export function createFinishEndpoint(endpointStyle: EndpointStyle): Endpoint | null {
  const endpoint = createEndpoint(endpointStyle);
  if (endpoint) {
    return createEndpoint(endpointStyle, endpoint.modalFinishSize);
  }
  return endpoint;
}

export function createEndpoint(
  endpointStyle: EndpointStyle,
  size?: EndpointSize
): Endpoint | null {
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
    case 'solid-diamond': {
      return new SolidDiamond(
        getSize(
          size ? size : SolidDiamond.modalStartSize,
          SolidDiamond.availableSizesSolidDiamond
        )
      );
    }
    case 'hollow-diamond': {
      return new HollowDiamond(
        getSize(
          size ? size : HollowDiamond.modalStartSize,
          SolidDiamond.availableSizesSolidDiamond
        )
      );
    }
    case 'half-circle': {
      return new HalfCircle(
        getSize(size ? size : HalfCircle.modalStartSize, HalfCircle.availableSizesHalfCircle)
      );
    }
  }

  return null;
}

function getSize(size: EndpointSize, availableSizes: EndpointSize[]): EndpointSize {
  if (availableSizes.includes(size)) {
    return size;
  } else if (availableSizes.length > 0) {
    return availableSizes[Math.trunc(availableSizes.length / 2)];
  }
  return 'medium';
}
