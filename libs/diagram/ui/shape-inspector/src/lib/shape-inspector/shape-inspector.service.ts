import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { DrawChainData, ExtendedShapeViewData } from '../types';

@Injectable()
export class ShapeInspectorService {
  extendedShapeViewData = new Map<string, ExtendedShapeViewData>();

  private expandedDataChangedSubject$ = new BehaviorSubject<void>(undefined);
  private expandedDataChanged$ = this.expandedDataChangedSubject$.asObservable();

  vm$: Observable<DrawChainData> = combineLatest([
    this.store.select(selectShapes),
    this.store.select(selectCurrentPage),
    this.expandedDataChanged$,
  ]).pipe(
    map(([shapes, page]) => {
      const drawChain: Shape[] = [];
      const expanded: boolean[] = [];
      let checksPass = true;
      if (page) {
        let nextId = page.firstShapeId;
        let lastId = '';
        while (nextId) {
          const s = shapes.get(nextId);
          if (s) {
            const e = this.extendedShapeViewData.get(s.id);
            if (e === undefined) {
              this.extendedShapeViewData.set(s.id, {
                expandedInDrawChain: false,
                expandedInGroupView: false,
              });
            }
            if (s.prevShapeId !== lastId) {
              checksPass = false;
            }
            drawChain.push(s);
            expanded.push(e ? e.expandedInDrawChain : false);
            nextId = s.nextShapeId;
            lastId = s.id;
          } else {
            nextId = '';
          }
        }
        if (page.lastShapeId !== lastId) {
          checksPass = false;
        }
        for (const id of this.extendedShapeViewData.keys()) {
          if (!shapes.has(id)) {
            this.extendedShapeViewData.delete(id);
          }
        }
        return { drawChain, expanded, checksPass };
      }
      checksPass = false;
      return { drawChain, expanded, checksPass };
    })
  );

  constructor(private store: Store) {}

  toggleExpandedInDrawChain(id: string) {
    const e = this.extendedShapeViewData.get(id);
    if (e) {
      const n: ExtendedShapeViewData = { ...e, expandedInDrawChain: !e.expandedInDrawChain };
      this.extendedShapeViewData.set(id, n);
      this.expandedDataChangedSubject$.next();
    }
  }
}
