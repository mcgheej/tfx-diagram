import { GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { IndicatorPosition } from './page-position-indicator.config';

export class PagePositionIndicatorRef {
  constructor(private overlayRef: OverlayRef) {}

  public close(): void {
    this.overlayRef.dispose();
  }

  public updatePosition(position: IndicatorPosition) {
    const strategy = this.getPositionStrategy();
    if (position && (position.left || position.right)) {
      position.left ? strategy.left(position.left) : strategy.right(position.right);
    } else {
      strategy.centerHorizontally();
    }

    if (position && (position.top || position.bottom)) {
      position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
    } else {
      strategy.centerVertically();
    }

    this.overlayRef.updatePosition();
    return this;
  }

  private getPositionStrategy(): GlobalPositionStrategy {
    return this.overlayRef.getConfig().positionStrategy as GlobalPositionStrategy;
  }
}
