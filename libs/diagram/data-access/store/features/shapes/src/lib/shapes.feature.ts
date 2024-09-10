import { createFeature, createSelector } from '@ngrx/store';
import { ConnectionProps, ShapeProps } from '@tfx-diagram/diagram/data-access/shape-classes';
import { shapesFeatureKey } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { shapesReducer } from './shapes.reducer';

export const shapesFeature = createFeature({
  name: shapesFeatureKey,
  reducer: shapesReducer,
});

export const {
  name,
  reducer,
  selectShapesState,
  selectShapes,
  selectConnections,
  selectCopyBuffer,
  selectPasteCount,
  selectMovingConnectionIds,
  selectLineColor,
  selectFillColor,
  selectLineWidth,
  selectLineDash,
  selectStartEndpoint,
  selectFinishEndpoint,
  selectFontProps,
} = shapesFeature;

export const selectShapeObjects = createSelector(selectShapes, (shapes) => {
  const shapeObjects: ShapeProps[] = [];
  shapes.forEach((shape) => shapeObjects.push(shape.getProps()));
  return shapeObjects;
});

export const selectConnectionObjects = createSelector(selectConnections, (connections) => {
  const connectionObjects: ConnectionProps[] = [];
  connections.forEach((connection) => connectionObjects.push(connection.getProps()));
  return connectionObjects;
});

export const selectEndpoints = createSelector(
  selectStartEndpoint,
  selectFinishEndpoint,
  (startEndpoint, finishEndpoint) => {
    return {
      startEndpoint,
      finishEndpoint,
    };
  }
);
