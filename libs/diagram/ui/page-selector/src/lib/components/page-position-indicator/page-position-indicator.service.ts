import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { PagePositionIndicatorRef } from './page-position-indicator-ref';
import { PagePositionIndicatorComponent } from './page-position-indicator.component';
import { DEFAULT_CONFIG, PagePositionIndicatorConfig } from './page-position-indicator.config';

@Injectable({
  providedIn: 'root',
})
export class PagePositionIndicatorService {
  constructor(private overlay: Overlay) {}

  // Open Indicator
  // --------------
  public open(config: PagePositionIndicatorConfig = {}): PagePositionIndicatorRef {
    const indicatorConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(indicatorConfig);
    const indicatorRef = new PagePositionIndicatorRef(overlayRef);
    this.attachIndicatorContainer(overlayRef);
    return indicatorRef;
  }

  // ---------------------------------------------------------------------------

  private createOverlay(config: PagePositionIndicatorConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachIndicatorContainer(overlayRef: OverlayRef) {
    const containerPortal = new ComponentPortal(PagePositionIndicatorComponent, null);
    const containerRef: ComponentRef<PagePositionIndicatorComponent> =
      overlayRef.attach(containerPortal);
    return containerRef.instance;
  }

  private getOverlayConfig(config: PagePositionIndicatorConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .left(config.position?.left)
      .top(config.position?.top);
    // .flexibleConnectedTo(config.associatedElement)
    // .withPositions(config.positions);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    return overlayConfig;
  }
}
