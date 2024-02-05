import { InjectionToken } from '@angular/core';
import { ZoomControlConfig } from './zoom-control.types';

export const ZOOM_DATA = new InjectionToken<ZoomControlConfig>('ZOOM_DATA');
