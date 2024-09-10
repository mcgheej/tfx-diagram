import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Line, Rectangle } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { selectSelectedShapeIds } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import {
  selectEndpoints,
  selectFillColor,
  selectFontProps,
  selectLineColor,
  selectLineDash,
  selectLineWidth,
  selectShapes,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { FontProps } from '@tfx-diagram/electron-renderer-web/shared-types';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'tfx-page-ribbon',
  templateUrl: './page-ribbon.component.html',
  styleUrls: ['./page-ribbon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageRibbonComponent {
  @Input() showControls = false;

  colors$ = combineLatest([
    this.store.select(selectLineColor),
    this.store.select(selectFillColor),
    this.store.select(selectSelectedShapeIds),
    this.store.select(selectShapes),
  ]).pipe(
    map(([lineColor, fillColor, selectedShapeIds, shapes]) => {
      if (selectedShapeIds.length === 1) {
        const shape = shapes.get(selectedShapeIds[0]);
        if (shape) {
          return shape.colors();
        }
      }
      return {
        lineColor,
        fillColor,
      };
    }),
    distinctUntilChanged((prev, curr) => {
      return prev.fillColor === curr.fillColor && prev.lineColor === curr.lineColor;
    })
  );

  lineDash$ = combineLatest([
    this.store.select(selectLineDash),
    this.store.select(selectSelectedShapeIds),
    this.store.select(selectShapes),
  ]).pipe(
    map(([lineDash, selectedShapeIds, shapes]) => {
      if (selectedShapeIds.length === 1) {
        const shape = shapes.get(selectedShapeIds[0]);
        if (shape) {
          if ((shape as Line).lineDash) {
            return (shape as Line).lineDash;
          }
          return [];
        }
      }
      return lineDash;
    })
  );

  lineWidth$ = combineLatest([
    this.store.select(selectLineWidth),
    this.store.select(selectSelectedShapeIds),
    this.store.select(selectShapes),
  ]).pipe(
    map(([lineWidth, selectedShapeIds, shapes]) => {
      if (selectedShapeIds.length === 1) {
        const shape = shapes.get(selectedShapeIds[0]);
        if (shape) {
          if ((shape as Line).lineWidth) {
            return (shape as Line).lineWidth;
          }
          return 0.5;
        }
      }
      return lineWidth;
    }),
    distinctUntilChanged()
  );

  endpoints$ = combineLatest([
    this.store.select(selectEndpoints),
    this.store.select(selectSelectedShapeIds),
    this.store.select(selectShapes),
  ]).pipe(
    map(([endpoints, selectedShapeIds, shapes]) => {
      if (selectedShapeIds.length === 1) {
        const shape = shapes.get(selectedShapeIds[0]);
        if (shape) {
          if ((shape as Line).finishEndpoint !== undefined) {
            return {
              startEndpoint: (shape as Line).startEndpoint,
              finishEndpoint: (shape as Line).finishEndpoint,
            };
          }
          return {
            startEndpoint: null,
            finishEndpoint: null,
          };
        }
      }
      return endpoints;
    }),
    distinctUntilChanged()
  );

  fontProps$ = combineLatest([
    this.store.select(selectFontProps),
    this.store.select(selectSelectedShapeIds),
    this.store.select(selectShapes),
  ]).pipe(
    map(([fontProps, selectedShapeIds, shapes]) => {
      if (selectedShapeIds.length === 1) {
        const shape = shapes.get(selectedShapeIds[0]);
        if (shape) {
          if ((shape as Rectangle).textConfig !== undefined) {
            return (shape as Rectangle).textConfig as FontProps;
          }
        }
      }
      return fontProps;
    })
  );

  vm$ = combineLatest([
    this.colors$,
    this.lineDash$,
    this.lineWidth$,
    this.endpoints$,
    this.fontProps$,
  ]).pipe(
    map(([colors, lineDash, lineWidth, endpoints, fontProps]) => {
      return {
        colors,
        lineDash,
        lineWidth,
        endpoints,
        fontProps,
      };
    })
  );

  constructor(private store: Store) {}
}
