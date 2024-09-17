import { Endpoint } from '../endpoint';
import {
  HalfCircle,
  HollowArrow,
  HollowCircle,
  HollowDiamond,
  SolidCircle,
  SolidDiamond,
  StandardArrow,
} from '../endpoint-classes';
import { EndpointSize, EndpointStyle } from '../endpoint.types';
import { getSize } from './get-size';

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
        getSize(
          size ? size : HollowArrow.modalStartSize,
          HollowArrow.availableSizesHollowArrow
        )
      );
    }
    case 'solid-circle': {
      return new SolidCircle(
        getSize(
          size ? size : SolidCircle.modalStartSize,
          SolidCircle.availableSizesSolidCircle
        )
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
        getSize(
          size ? size : HalfCircle.modalStartSize,
          HalfCircle.availableSizesHalfCircle
        )
      );
    }
  }

  return null;
}
