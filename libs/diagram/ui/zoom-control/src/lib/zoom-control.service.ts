import { Inject, Injectable } from '@angular/core';
import { ZOOM_DATA } from './zoom-control.tokens';
import { ZoomControlConfig } from './zoom-control.types';
import { ZoomSharedDataService } from './zoom-shared-data.service';

@Injectable()
export class ZoomControlService {
  constructor(
    @Inject(ZOOM_DATA) private zoomConfig: ZoomControlConfig,
    private sharedData: ZoomSharedDataService
  ) {}

  getInitialZoom(): number {
    return this.zoomConfig.initialZoomFactor;
  }

  getDecreasedZoom(): number {
    if (this.sharedData.zoomFactor) {
      for (let i = this.zoomConfig.presetZoomFactors.length - 1; i >= 0; i--) {
        if (this.zoomConfig.presetZoomFactors[i] < this.sharedData.zoomFactor) {
          return this.zoomConfig.presetZoomFactors[i];
        }
      }
      return this.zoomConfig.presetZoomFactors[0];
    }
    return this.zoomConfig.initialZoomFactor;
  }

  getIncreasedZoom(): number {
    if (this.sharedData.zoomFactor) {
      for (let i = 0; i < this.zoomConfig.presetZoomFactors.length; i++) {
        if (this.zoomConfig.presetZoomFactors[i] > this.sharedData.zoomFactor) {
          return this.zoomConfig.presetZoomFactors[i];
        }
      }
      return this.zoomConfig.presetZoomFactors[this.zoomConfig.presetZoomFactors.length - 1];
    }
    return this.zoomConfig.initialZoomFactor;
  }
}
