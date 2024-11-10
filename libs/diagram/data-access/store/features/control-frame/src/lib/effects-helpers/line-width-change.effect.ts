import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  LineWidthButtonServiceActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import {
  Connection,
  Shape,
  getDrawableShapesInSelection,
  getShape,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  selectConnections,
  selectShapes,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { of, switchMap } from 'rxjs';
import { selectSelectedShapeIds } from '../control-frame.feature';

export const lineWidthChange = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(LineWidthButtonServiceActions.lineWidthChange),
      concatLatestFrom(() => [
        store.select(selectSelectedShapeIds),
        store.select(selectShapes),
        store.select(selectConnections),
      ]),
      switchMap(([action, selectedShapeIds, shapes, connections]) => {
        if (selectedShapeIds.length > 0) {
          const modifiedShapes = new Map<string, Shape>();
          const selectedShapes = getDrawableShapesInSelection(selectedShapeIds, shapes);
          for (const shape of selectedShapes) {
            modifiedShapes.set(shape.id, shape.copy({ lineWidth: action.lineWidth }));
          }
          const affectedConnectionIds: string[] = [];
          connections.forEach((connection) => {
            if (modifiedShapes.get(connection.shapeId)) {
              affectedConnectionIds.push(connection.id);
            }
          });
          const modifiedConnections: Connection[] = [];
          if (affectedConnectionIds.length > 0) {
            affectedConnectionIds.map((id) => {
              const connection = connections.get(id);
              if (connection) {
                const connector = getShape(
                  connection.connectorId,
                  modifiedShapes,
                  shapes,
                  false
                );
                const modifiedShape = modifiedShapes.get(connection.shapeId);
                if (modifiedShape && connector && connector.category() === 'connector') {
                  const modifiedConnection =
                    connection.modifyConnectionPoint(modifiedShape);
                  modifiedConnections.push(modifiedConnection);
                  const modifiedConnector =
                    modifiedConnection.reshapeConnector(connector);
                  modifiedShapes.set(modifiedConnector.id, modifiedConnector);
                }
              }
            });
          }
          return of(
            ControlFrameEffectsActions.selectedShapesLineWidthChange({
              lineWidth: action.lineWidth,
              modifiedShapes: [...modifiedShapes.values()],
              modifiedConnections,
            })
          );
        } else {
          return of(
            ControlFrameEffectsActions.lineWidthChange({ lineWidth: action.lineWidth })
          );
        }
      })
    );
  });
};
