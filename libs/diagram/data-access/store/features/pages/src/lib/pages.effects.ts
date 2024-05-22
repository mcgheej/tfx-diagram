import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  PagesEffectsActions,
  SketchbookEffectsActions,
  SketchbookViewComponentActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { pageNameInUse } from '@tfx-diagram/diagram/util/misc-functions';
import { INITIAL_ZOOM_FACTOR, Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { nanoid } from 'nanoid';
import { of, switchMap } from 'rxjs';
import { selectPageIds, selectPages } from './pages.feature';

@Injectable()
export class PagesEffects {
  addNewPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SketchbookViewComponentActions.addPageConfirmed),
      concatLatestFrom(() => [
        this.store.select(selectPages),
        this.store.select(selectPageIds),
      ]),
      switchMap(([{ size, format, layout }, pages, pageIds]) => {
        return of(
          PagesEffectsActions.newPageReady({
            page: {
              id: nanoid(),
              title: this.getNewPageName(pages, pageIds),
              size,
              format,
              layout,
              zoomFactor: INITIAL_ZOOM_FACTOR,
              windowCentre: null,
              firstShapeId: '',
              lastShapeId: '',
            },
          })
        );
      })
    );
  });

  closePages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SketchbookEffectsActions.pagesClose),
      switchMap(() => {
        return of(PagesEffectsActions.sketchbookClose());
      })
    );
  });

  // This effect needs to fire whenever the current page changes
  currentPageChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SketchbookViewComponentActions.currentPageChange),
      switchMap(() => {
        return of(PagesEffectsActions.currentPageChange());
      })
    );
  });

  openSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SketchbookEffectsActions.openSuccess),
      switchMap(({ fileData }) => {
        return of(PagesEffectsActions.openSuccess({ fileData }));
      })
    );
  });

  constructor(private actions$: Actions, private store: Store) {}

  private getNewPageName(pages: { [id: string]: Page }, ids: string[]): string {
    let i = 1;
    let nameChecking = true;
    let newName = 'Page 1';
    while (nameChecking) {
      if (pageNameInUse(newName, pages, ids)) {
        i++;
        newName = 'Page ' + i.toString();
      } else {
        nameChecking = false;
      }
    }
    return newName;
  }
}
