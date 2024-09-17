import { EndpointSize } from '../endpoint.types';

export function getSize(
  size: EndpointSize,
  availableSizes: EndpointSize[]
): EndpointSize {
  if (availableSizes.includes(size)) {
    return size;
  } else if (availableSizes.length > 0) {
    return availableSizes[Math.trunc(availableSizes.length / 2)];
  }
  return 'medium';
}
