import { Inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  FileMenuActions,
  PagesEffectsActions,
  SaveCloseMachineActions,
  ShellComponentActions,
  SketchbookEffectsActions,
  SketchbookViewComponentActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectPagesState } from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  selectConnectionObjects,
  selectShapeObjects,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { ELECTRON_API } from '@tfx-diagram/diagram/util/app-tokens';
import {
  ContextBridgeApi,
  currentVersion,
} from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { INITIAL_ZOOM_FACTOR } from '@tfx-diagram/electron-renderer-web/shared-types';
import { nanoid } from 'nanoid';
import { map, of, switchMap } from 'rxjs';
import { selectSketchbookState } from './sketchbook.feature';

@Injectable()
export class SketchbookEffects {
  newSketchbook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FileMenuActions.newSketchbookCreate),
      switchMap(({ page }) => {
        Shape.resetIdsMap();
        return of(
          SketchbookEffectsActions.newPageReady({
            page: {
              id: nanoid(),
              title: page.title,
              size: { ...page.size },
              format: page.format,
              layout: page.layout,
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

  openSketchbook$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(FileMenuActions.openSketchbookClick),
        map(async () => {
          try {
            const result = await this.electronApi.openFile();
            if (result) {
              Shape.loadIdsMap(result.shapeObjects);
              this.store.dispatch(SketchbookEffectsActions.openSuccess({ fileData: result }));
            } else {
              this.store.dispatch(SketchbookEffectsActions.openCancel());
            }
          } catch (err) {
            // TODO: throw up toast
            console.log(err);
            this.store.dispatch(SketchbookEffectsActions.openError());
          }
        })
      );
    },
    { dispatch: false }
  );

  saveSketchbook$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(FileMenuActions.saveSketchbookClick, SaveCloseMachineActions.saveClick),
        concatLatestFrom(() => [
          this.store.select(selectSketchbookState),
          this.store.select(selectPagesState),
          this.store.select(selectShapeObjects),
          this.store.select(selectConnectionObjects),
        ]),
        map(async ([, sketchbook, pages, shapeObjects, connectionObjects]) => {
          try {
            if (sketchbook.path) {
              await this.electronApi.saveFile({
                version: currentVersion,
                sketchbook,
                pages,
                shapeObjects,
                connectionObjects,
              });
              this.store.dispatch(
                SketchbookEffectsActions.saveSuccess({
                  result: {
                    title: sketchbook.title,
                    path: sketchbook.path,
                  },
                })
              );
            } else {
              const result = await this.electronApi.saveFileAs({
                version: currentVersion,
                sketchbook,
                pages,
                shapeObjects,
                connectionObjects,
              });
              if (result && result.path) {
                this.store.dispatch(SketchbookEffectsActions.saveSuccess({ result }));
              } else {
                this.store.dispatch(SketchbookEffectsActions.saveCancel());
              }
            }
          } catch (err) {
            // TODO: throw up toast
            console.log(err);
            this.store.dispatch(SketchbookEffectsActions.saveError());
          }
        })
      );
    },
    { dispatch: false }
  );

  exportJpeg$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ShellComponentActions.exportJpegConfirmed),
        map(async ({ data }) => {
          try {
            await this.electronApi.exportJpeg(data);
            this.store.dispatch(SketchbookEffectsActions.exportSuccess());
          } catch (err) {
            // TODO: throw up toast
            console.log(err);
            this.store.dispatch(SketchbookEffectsActions.exportError());
          }
        })
      );
    },
    { dispatch: false }
  );

  closeSketchbook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SaveCloseMachineActions.closeStart),
      switchMap(() => {
        return of(SketchbookEffectsActions.pagesClose());
      })
    );
  });

  // addNewPage$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(SketchbookViewComponentActions.addPageConfirmed),
  //     concatLatestFrom(() => [
  //       this.store.select(selectPages),
  //       this.store.select(selectPageIds),
  //     ]),
  //     switchMap(([{ size, format, layout }, pages, pageIds]) => {
  //       return of(
  //         SketchbookEffectsActions.newPageReady({
  //           page: {
  //             id: nanoid(),
  //             title: this.getNewPageName(pages, pageIds),
  //             size,
  //             format,
  //             layout,
  //             zoomFactor: INITIAL_ZOOM_FACTOR,
  //             windowCentre: null,
  //             firstShapeId: '',
  //             lastShapeId: '',
  //           },
  //         })
  //       );
  //     })
  //   );
  // });

  deletePage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SketchbookViewComponentActions.deletePageClick),
      switchMap(({ page }) => {
        return of(SketchbookEffectsActions.deletePageClick({ page }));
      })
    );
  });

  // This effect needs to fire whenever the current page changes
  currentPageChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        PagesEffectsActions.pageAdded,
        SketchbookViewComponentActions.currentPageChange,
        SketchbookEffectsActions.deletePageClick
      ),
      switchMap(() => {
        return of(SketchbookEffectsActions.currentPageChange());
      })
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(ELECTRON_API) private electronApi: ContextBridgeApi
  ) {}

  // private getNewPageName(pages: { [id: string]: Page }, ids: string[]): string {
  //   let i = 1;
  //   let nameChecking = true;
  //   let newName = 'Page 1';
  //   while (nameChecking) {
  //     if (pageNameInUse(newName, pages, ids)) {
  //       i++;
  //       newName = 'Page ' + i.toString();
  //     } else {
  //       nameChecking = false;
  //     }
  //   }
  //   return newName;
  // }
}
