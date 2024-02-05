import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  SettingsEffectsActions,
  ShellComponentActions,
  ViewMenuActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { LocalStorage } from '@tfx-diagram/diagram/util/misc-functions';
import { SettingsState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import {
  Alignment,
  LS_GRID_SHOW,
  LS_GRID_SIZE,
  LS_GRID_SNAP,
  LS_JPEG_QUALITY,
  LS_MOUSE_POSITION_COORDS_TYPE,
  LS_PAGE_ALIGNMENT_IN_VIEWPORT,
  LS_SCREEN_PIXEL_DENSITY,
  LS_SHAPE_SNAP,
  LS_SHOW_MOUSE_POSITION,
  LS_SHOW_RULERS,
  LS_SHOW_SHAPE_INSPECTOR,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { of, switchMap } from 'rxjs';
import {
  selectGridShow,
  selectGridSnap,
  selectPageAlignmentInViewport,
  selectShapeSnap,
  selectShowMousePosition,
  selectShowRulers,
  selectShowShapeInspector,
} from './settings.feature';
import { initialState } from './settings.reducer';

@Injectable()
export class SettingsEffects {
  /**
   *
   *
   */
  appStart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShellComponentActions.appStart),
      switchMap(() => {
        return of(
          SettingsEffectsActions.appStart({
            changes: getPersistedSettings(),
          })
        );
      })
    );
  });

  toggleShowRulers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ViewMenuActions.showRulersToggle),
      concatLatestFrom(() => [this.store.select(selectShowRulers)]),
      switchMap(([, showRulers]) => {
        LocalStorage.setItem(LS_SHOW_RULERS, !showRulers);
        return of(SettingsEffectsActions.showRulersToggle());
      })
    );
  });

  toggleShowShapeInspector$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ViewMenuActions.showShapeInspectorToggle),
      concatLatestFrom(() => [this.store.select(selectShowShapeInspector)]),
      switchMap(([, showShapeInspector]) => {
        LocalStorage.setItem(LS_SHOW_SHAPE_INSPECTOR, !showShapeInspector);
        return of(SettingsEffectsActions.showShapeInspectorToggle());
      })
    );
  });

  toggleShapeSnap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ViewMenuActions.shapeSnapToggle),
      concatLatestFrom(() => [this.store.select(selectShapeSnap)]),
      switchMap(([, shapeSnap]) => {
        LocalStorage.setItem(LS_SHAPE_SNAP, !shapeSnap);
        return of(SettingsEffectsActions.shapeSnapToggle());
      })
    );
  });

  toggleShowMousePosition$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ViewMenuActions.showMousePositionToggle),
      concatLatestFrom(() => [this.store.select(selectShowMousePosition)]),
      switchMap(([, showMousePosition]) => {
        LocalStorage.setItem(LS_SHOW_MOUSE_POSITION, !showMousePosition);
        return of(SettingsEffectsActions.showMousePositionToggle());
      })
    );
  });

  toggleGridShow$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ViewMenuActions.showGridToggle),
      concatLatestFrom(() => [this.store.select(selectGridShow)]),
      switchMap(([, gridShow]) => {
        LocalStorage.setItem(LS_GRID_SHOW, !gridShow);
        return of(SettingsEffectsActions.showGridToggle());
      })
    );
  });

  toggleGridSnap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ViewMenuActions.snapToGridToggle),
      concatLatestFrom(() => [this.store.select(selectGridSnap)]),
      switchMap(([, gridSnap]) => {
        LocalStorage.setItem(LS_GRID_SNAP, !gridSnap);
        return of(SettingsEffectsActions.snapToGridToggle());
      })
    );
  });

  setPageAlignment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ViewMenuActions.pageAlignmentChange),
      concatLatestFrom(() => [this.store.select(selectPageAlignmentInViewport)]),
      switchMap(([{ value }, pageAlignment]) => {
        const newPageAlignment: Alignment = { ...pageAlignment, ...value };
        LocalStorage.setItem(LS_PAGE_ALIGNMENT_IN_VIEWPORT, newPageAlignment);
        return of(SettingsEffectsActions.pageAlignmentChange({ alignment: newPageAlignment }));
      })
    );
  });

  setScreenPixelDensity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ViewMenuActions.screenPixelDensityChange),
      switchMap(({ value }) => {
        LocalStorage.setItem(LS_SCREEN_PIXEL_DENSITY, value);
        return of(SettingsEffectsActions.screenPixelDensityChange({ value }));
      })
    );
  });

  setMousePositionCoordsType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ViewMenuActions.mousePositionCoordsTypeChange),
      switchMap(({ value }) => {
        LocalStorage.setItem(LS_MOUSE_POSITION_COORDS_TYPE, value);
        return of(SettingsEffectsActions.mousePositionCoordsTypeChange({ value }));
      })
    );
  });

  setJpegQuality$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShellComponentActions.exportJpegConfirmed, ShellComponentActions.exportJpegCancel),
      switchMap(({ quality }) => {
        LocalStorage.setItem(LS_JPEG_QUALITY, quality);
        return of(SettingsEffectsActions.jpegQualityChange({ quality }));
      })
    );
  });

  constructor(private actions$: Actions, private store: Store) {}
}

const getPersistedSettings = (): Partial<SettingsState> => {
  const result: Partial<SettingsState> = {};
  result.gridShow = LocalStorage.getItem(LS_GRID_SHOW, initialState.gridShow);
  result.gridSnap = LocalStorage.getItem(LS_GRID_SNAP, initialState.gridSnap);
  result.gridSize = LocalStorage.getItem(LS_GRID_SIZE, initialState.gridSize);
  result.shapeSnap = LocalStorage.getItem(LS_SHAPE_SNAP, initialState.shapeSnap);
  result.showRulers = LocalStorage.getItem(LS_SHOW_RULERS, initialState.showRulers);
  result.screenPixelDensity = LocalStorage.getItem(
    LS_SCREEN_PIXEL_DENSITY,
    initialState.screenPixelDensity
  );
  result.pageAlignmentInViewport = LocalStorage.getItem(
    LS_PAGE_ALIGNMENT_IN_VIEWPORT,
    initialState.pageAlignmentInViewport
  );
  result.showMousePosition = LocalStorage.getItem(
    LS_SHOW_MOUSE_POSITION,
    initialState.showMousePosition
  );
  result.mousePositionCoordsType = LocalStorage.getItem(
    LS_MOUSE_POSITION_COORDS_TYPE,
    initialState.mousePositionCoordsType
  );
  result.showShapeInspector = LocalStorage.getItem(
    LS_SHOW_SHAPE_INSPECTOR,
    initialState.showShapeInspector
  );
  result.jpegQuality = LocalStorage.getItem(LS_JPEG_QUALITY, initialState.jpegQuality);
  return result;
};
