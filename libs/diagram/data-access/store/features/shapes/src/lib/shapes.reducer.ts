import { createReducer, on } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  EditMenuActions,
  ShapesEffectsActions,
  SketchbookEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import {
  Arc,
  ArcConfig,
  Circle,
  CircleConfig,
  CircleConnection,
  CircleConnectionProps,
  Connection,
  Curve,
  CurveConfig,
  Endpoint,
  Group,
  GroupConfig,
  Line,
  LineConfig,
  Rectangle,
  RectangleConfig,
  RectangleConnection,
  RectangleConnectionProps,
  Shape,
  ShapeProps,
  Triangle,
  TriangleConfig,
  TriangleConnection,
  TriangleConnectionProps,
  createEndpoint,
  getAllShapesInSelection,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { ShapesState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import {
  ColorRef,
  FontProps,
  INITIAL_FONT_FAMILY,
  INITIAL_FONT_SIZE_PT,
  INITIAL_LINE_WIDTH,
  lineDashSolid,
} from '@tfx-diagram/electron-renderer-web/shared-types';

export type ShapeObjects = { [id: string]: ShapeProps };

export const initialState: ShapesState = {
  shapes: new Map<string, Shape>(),
  connections: new Map<string, Connection>(),
  copyBuffer: [],
  pasteCount: 0,
  movingConnectionIds: [],
  lineColor: { colorSet: 'theme', ref: 'text1-3' },
  fillColor: { colorSet: 'empty', ref: '' },
  lineWidth: INITIAL_LINE_WIDTH,
  lineDash: lineDashSolid,
  startEndpoint: null,
  finishEndpoint: null,
  fontProps: {
    mmPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    alignment: { horizontal: 'center', vertical: 'center' },
    // fontFamily: 'sans-serif',
    fontFamily: INITIAL_FONT_FAMILY,
    fontSizePt: INITIAL_FONT_SIZE_PT,
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',
    underline: false,
    color: { colorSet: 'theme', ref: 'text1-3' },
    wordwrap: true,
  },
};

export const shapesReducer = createReducer(
  initialState,
  on(
    EditMenuActions.copyClick,
    EditMenuActions.cutClick,
    (state, { selectedShapeIds, textEdit }) => {
      if (selectedShapeIds.length > 0 && textEdit === null) {
        // const copyBuffer: Shape[] = [];
        // selectedShapeIds.map((id) => {
        //   const s = state.shapes.get(id);
        //   if (s) {
        //     copyBuffer.push(s.copy({}));
        //   }
        // });
        return {
          ...state,
          copyBuffer: getAllShapesInSelection(selectedShapeIds, state.shapes).map((s) =>
            s.copy({}),
          ),
          pasteCount: 0,
        };
      }
      return state;
    },
  ),
  on(
    ControlFrameEffectsActions.dragStartHandle,
    (state, { connectionHook, movingConnectionIds }) => {
      if (connectionHook) {
        const updatedConnections = new Map(state.connections);
        updatedConnections.delete(connectionHook.id);
        return {
          ...state,
          connections: updatedConnections,
          movingConnectionIds,
        };
      }
      return {
        ...state,
        movingConnectionIds,
      };
    },
  ),
  on(
    ControlFrameEffectsActions.dragMoveHandle,
    ControlFrameEffectsActions.dragMoveSingleSelection,
    ControlFrameEffectsActions.dragMoveMultiSelection,
    (state, { modifiedConnections }) => {
      if (modifiedConnections.length > 0) {
        const updatedConnections = new Map(state.connections);
        modifiedConnections.map((connection) => {
          updatedConnections.set(connection.id, connection);
        });
        return {
          ...state,
          connections: updatedConnections,
        };
      }
      return state;
    },
  ),
  on(ControlFrameEffectsActions.dragEndHandle, (state, { connectionHook }) => {
    if (connectionHook && connectionHook.shapeId) {
      const updatedConnections = new Map(state.connections);
      updatedConnections.set(connectionHook.id, connectionHook);
      return {
        ...state,
        connections: updatedConnections,
        movingConnectionIds: [],
      };
    }
    return {
      ...state,
      movingConnectionIds: [],
    };
  }),
  on(
    ControlFrameEffectsActions.dragStartSingleSelection,
    (state, { movingConnectionIds, compromisedConnectionIds }) => {
      const connections = updateConnectionsDragStartSelection(
        state,
        compromisedConnectionIds,
      );
      return {
        ...state,
        connections,
        movingConnectionIds,
      };
    },
  ),
  on(ControlFrameEffectsActions.dragEndSingleSelection, (state) => {
    if (state.movingConnectionIds.length === 0) {
      return state;
    }
    return {
      ...state,
      movingConnectionIds: [],
    };
  }),
  on(
    ControlFrameEffectsActions.dragStartMultiSelection,
    (state, { movingConnectionIds, compromisedConnectionIds }) => {
      return {
        ...state,
        movingConnectionIds,
        connections: updateConnectionsDragStartSelection(state, compromisedConnectionIds),
      };
    },
  ),
  on(ControlFrameEffectsActions.dragEndMultiSelection, (state) => {
    return {
      ...state,
      movingConnectionIds: [],
    };
  }),
  on(ControlFrameEffectsActions.lineColorChange, (state, { lineColor }) => {
    return {
      ...state,
      lineColor,
    };
  }),
  on(ControlFrameEffectsActions.fillColorChange, (state, { fillColor }) => {
    return {
      ...state,
      fillColor: fillColor,
    };
  }),
  on(ControlFrameEffectsActions.lineDashChange, (state, { lineDash }) => {
    return {
      ...state,
      lineDash,
    };
  }),
  on(ControlFrameEffectsActions.lineWidthChange, (state, { lineWidth }) => {
    return {
      ...state,
      lineWidth,
    };
  }),
  on(ControlFrameEffectsActions.startEndpointChange, (state, { endpoint }) => {
    return {
      ...state,
      startEndpoint: endpoint,
    };
  }),
  on(ControlFrameEffectsActions.finishEndpointChange, (state, { endpoint }) => {
    return {
      ...state,
      finishEndpoint: endpoint,
    };
  }),
  on(ControlFrameEffectsActions.fontPropsChange, (state, { props }) => {
    const newFontProps = { ...state.fontProps, ...props };
    return {
      ...state,
      fontProps: newFontProps,
    };
  }),
  on(
    ControlFrameEffectsActions.selectedShapesLineColorChange,
    (state, { lineColor, selectedShapeIds }) => {
      return {
        ...updateSelectedColors(state, selectedShapeIds, lineColor, 'lineColor'),
        lineColor,
      };
    },
  ),
  on(
    ControlFrameEffectsActions.selectedShapesFillColorChange,
    (state, { fillColor, selectedShapeIds }) => {
      return {
        ...updateSelectedColors(state, selectedShapeIds, fillColor, 'fillColor'),
        fillColor,
      };
    },
  ),
  on(
    ControlFrameEffectsActions.selectedShapesLineDashChange,
    (state, { lineDash, selectedShapeIds }) => {
      return {
        ...updateSelectedLineDash(state, selectedShapeIds, lineDash),
        lineDash,
      };
    },
  ),
  on(
    ControlFrameEffectsActions.selectedShapesLineWidthChange,
    (state, { lineWidth, modifiedConnections, modifiedShapes }) => {
      const shapes = new Map(state.shapes);
      modifiedShapes.map((shape) => {
        shapes.set(shape.id, shape);
      });

      if (modifiedConnections.length > 0) {
        const connections = new Map(state.connections);
        modifiedConnections.map((connection) => {
          connections.set(connection.id, connection);
        });
        return {
          ...state,
          shapes,
          connections,
          lineWidth,
        };
      }
      return {
        ...state,
        shapes,
        lineWidth,
      };
    },
  ),
  // on(
  //   ControlFrameEffectsActions.selectedShapesLineWidthChange,
  //   (state, { lineWidth, selectedShapeIds }) => {
  //     return {
  //       ...updateSelectedLineWidths(state, selectedShapeIds, lineWidth),
  //       lineWidth,
  //     };
  //   }
  // ),
  on(
    ControlFrameEffectsActions.selectedShapesStartEndpointChange,
    (state, { endpoint, selectedShapeIds }) => {
      return {
        ...updateSelectedStartEndpoints(state, selectedShapeIds, endpoint),
        startEndpoint: endpoint,
      };
    },
  ),
  on(
    ControlFrameEffectsActions.selectedShapesFinishEndpointChange,
    (state, { endpoint, selectedShapeIds }) => {
      return {
        ...updateSelectedFinishEndpoints(state, selectedShapeIds, endpoint),
        finishEndpoint: endpoint,
      };
    },
  ),
  on(
    ControlFrameEffectsActions.selectedShapesFontPropsChange,
    (state, { props, selectedShapeIds }) => {
      const newFontProps: FontProps = { ...state.fontProps, ...props };
      return {
        ...updateSelectedFontProps(state, selectedShapeIds, props),
        fontProps: newFontProps,
      };
    },
  ),
  on(
    ControlFrameEffectsActions.selectedShapeTextConfigChange,
    (state, { shapeId, textConfig }) => {
      const shape = state.shapes.get(shapeId);
      if (shape) {
        const newShape = shape.copy({ textConfig });
        if (newShape) {
          const newShapes = new Map<string, Shape>(state.shapes);
          newShapes.set(newShape.id, newShape);
          return {
            ...state,
            shapes: newShapes,
          };
        }
      }
      return state;
    },
  ),
  on(ShapesEffectsActions.firstShapeOnPage, (state, { shape }) => {
    const newShapes = new Map(state.shapes);
    newShapes.set(shape.id, shape);
    return {
      ...state,
      shapes: newShapes,
    };
  }),
  on(
    ShapesEffectsActions.anotherShapeOnPage,
    ShapesEffectsActions.duplicatedShapesOnPage,
    ShapesEffectsActions.pasteShapesOnPage,
    ShapesEffectsActions.alignObjects,
    ShapesEffectsActions.distributeObjects,
    ShapesEffectsActions.bringToFront,
    ShapesEffectsActions.sendToBack,
    ShapesEffectsActions.bringItemForward,
    ShapesEffectsActions.sendItemBackward,
    ShapesEffectsActions.shapeResizeClick,
    ShapesEffectsActions.groupClick,
    (state, a) => {
      const { type, shapes } = a;
      if (shapes.length === 0) {
        return state;
      }
      const newShapes = new Map(state.shapes);
      for (const shape of shapes) {
        newShapes.set(shape.id, shape);
      }
      if (type === ShapesEffectsActions.PASTE_SHAPES_ON_PAGE) {
        return {
          ...state,
          shapes: newShapes,
          pasteCount: a.pasteCount,
        };
      }
      if (type === ShapesEffectsActions.ALIGN_OBJECTS) {
        const newConnections = new Map(state.connections);
        a.compromisedConnectionIds.map((id) => newConnections.delete(id));
        return {
          ...state,
          shapes: newShapes,
          connections: newConnections,
        };
      }
      return {
        ...state,
        shapes: newShapes,
      };
    },
  ),
  on(ShapesEffectsActions.ungroupClick, (state, { shapes, deletedGroupIds }) => {
    const newShapes = new Map(state.shapes);
    for (const shape of shapes) {
      newShapes.set(shape.id, shape);
    }
    for (const id of deletedGroupIds) {
      newShapes.delete(id);
    }
    return {
      ...state,
      shapes: newShapes,
    };
  }),
  on(
    ShapesEffectsActions.deleteShapesOnPage,
    (state, { deletedShapeIds, deletedConnectionIds, modifiedShapes }) => {
      const newShapes = new Map(state.shapes);
      deletedShapeIds.map((id) => {
        newShapes.delete(id);
        Rectangle.deleteCacheEntry(id);
      });
      modifiedShapes.map((shape) => {
        newShapes.set(shape.id, shape);
      });
      const newConnections = new Map(state.connections);
      deletedConnectionIds.map((id) => {
        newConnections.delete(id);
      });
      return {
        ...state,
        shapes: newShapes,
        connections: newConnections,
      };
    },
  ),
  on(SketchbookEffectsActions.deletePageClick, (state, { page }) => {
    if (page.firstShapeId) {
      const newShapes = new Map<string, Shape>(state.shapes);
      let shapeId = page.firstShapeId;
      while (shapeId) {
        const shape = newShapes.get(shapeId);
        if (shape) {
          shapeId = shape.nextShapeId;
          if (shape.groupId) {
            newShapes.delete(shape.groupId);
          }
          newShapes.delete(shape.id);
          Shape.shapeIdsMap.delete(shape.id);
          Rectangle.deleteCacheEntry(shape.id);
        } else {
          shapeId = '';
          console.log('Error - shape not found');
        }
      }
      return {
        ...state,
        shapes: newShapes,
      };
    }
    return state;
  }),
  on(SketchbookEffectsActions.openSuccess, (state, { fileData }) => {
    if (fileData.shapeObjects.length === 0) {
      return state;
    }
    const newShapes = new Map<string, Shape>();
    fileData.shapeObjects.map((shapeObject) => {
      switch (shapeObject.shapeType) {
        case 'circle': {
          newShapes.set(shapeObject.id, new Circle(shapeObject as CircleConfig));
          break;
        }
        case 'rectangle': {
          newShapes.set(shapeObject.id, new Rectangle(shapeObject as RectangleConfig));
          break;
        }
        case 'arc': {
          newShapes.set(shapeObject.id, new Arc(shapeObject as ArcConfig));
          break;
        }
        case 'curve': {
          const s = shapeObject as CurveConfig;
          const curveConfig: CurveConfig = {
            ...s,
            startEndpoint: s.startEndpoint
              ? createEndpoint(s.startEndpoint.endpointType, s.startEndpoint.size)
              : null,
            finishEndpoint: s.finishEndpoint
              ? createEndpoint(s.finishEndpoint.endpointType, s.finishEndpoint.size)
              : null,
          };
          newShapes.set(shapeObject.id, new Curve(curveConfig));
          break;
        }
        case 'line': {
          const s = shapeObject as LineConfig;
          const lineConfig: LineConfig = {
            ...s,
            startEndpoint: s.startEndpoint
              ? createEndpoint(s.startEndpoint.endpointType, s.startEndpoint.size)
              : null,
            finishEndpoint: s.finishEndpoint
              ? createEndpoint(s.finishEndpoint.endpointType, s.finishEndpoint.size)
              : null,
          };
          newShapes.set(shapeObject.id, new Line(lineConfig));
          break;
        }
        case 'triangle': {
          newShapes.set(shapeObject.id, new Triangle(shapeObject as TriangleConfig));
          break;
        }
        case 'group': {
          newShapes.set(shapeObject.id, new Group(shapeObject as GroupConfig));
          break;
        }
      }
    });
    const newConnections = new Map<string, Connection>();
    if (fileData.connectionObjects.length === 0) {
      return {
        ...state,
        shapes: newShapes,
        connections: newConnections,
      };
    }
    fileData.connectionObjects.map((connectionObject) => {
      switch (connectionObject.connectionType) {
        case 'circleConnection': {
          newConnections.set(
            connectionObject.id,
            new CircleConnection(connectionObject as CircleConnectionProps),
          );
          break;
        }
        case 'rectangleConnection': {
          newConnections.set(
            connectionObject.id,
            new RectangleConnection(connectionObject as RectangleConnectionProps),
          );
          break;
        }
        case 'triangleConnection': {
          newConnections.set(
            connectionObject.id,
            new TriangleConnection(connectionObject as TriangleConnectionProps),
          );
          break;
        }
      }
    });
    return {
      ...state,
      shapes: newShapes,
      connections: newConnections,
    };
  }),
  on(SketchbookEffectsActions.pagesClose, () => {
    return { ...initialState };
  }),
  on(ControlFrameEffectsActions.frameChange, (state, { modifiedShapes }) => {
    const modifiedShapesMap = new Map<string, Shape>(state.shapes);
    for (const shape of modifiedShapes) {
      modifiedShapesMap.set(shape.id, shape);
    }
    return {
      ...state,
      shapes: modifiedShapesMap,
    };
  }),
);

const updateSelectedColors = (
  state: ShapesState,
  selectedShapeIds: string[],
  color: ColorRef,
  lineOrFill: 'lineColor' | 'fillColor',
): ShapesState => {
  if (selectedShapeIds.length === 0) {
    return state;
  }
  const newShapes = new Map<string, Shape>(state.shapes);
  let shapesChanged = false;
  for (const shapeId of selectedShapeIds) {
    let shape = newShapes.get(shapeId);
    if (shape) {
      if (lineOrFill === 'lineColor') {
        shape = shape.copy({ strokeStyle: color });
      } else {
        shape = shape.copy({ fillStyle: color });
      }
      if (shape) {
        newShapes.set(shape.id, shape);
        shapesChanged = true;
      }
    }
  }
  if (shapesChanged) {
    return {
      ...state,
      shapes: newShapes,
    };
  }
  return state;
};

const updateSelectedLineDash = (
  state: ShapesState,
  selectedShapeIds: string[],
  lineDash: number[],
): ShapesState => {
  if (selectedShapeIds.length === 0) {
    return state;
  }
  const newShapes = new Map<string, Shape>(state.shapes);
  let shapesChanged = false;
  for (const shapeId of selectedShapeIds) {
    let shape = newShapes.get(shapeId);
    if (shape) {
      shape = shape.copy({ lineDash });
      if (shape) {
        newShapes.set(shape.id, shape);
        shapesChanged = true;
      }
    }
  }
  if (shapesChanged) {
    return {
      ...state,
      shapes: newShapes,
    };
  }
  return state;
};

const updateSelectedLineWidths = (
  state: ShapesState,
  selectedShapeIds: string[],
  lineWidth: number,
): ShapesState => {
  if (selectedShapeIds.length === 0) {
    return state;
  }
  const newShapes = new Map<string, Shape>(state.shapes);
  let shapesChanged = false;
  for (const shapeId of selectedShapeIds) {
    let shape = newShapes.get(shapeId);
    if (shape) {
      shape = shape.copy({ lineWidth });
      if (shape) {
        newShapes.set(shape.id, shape);
        shapesChanged = true;
      }
    }
  }
  if (shapesChanged) {
    return {
      ...state,
      shapes: newShapes,
    };
  }
  return state;
};

const updateSelectedStartEndpoints = (
  state: ShapesState,
  selectedShapeIds: string[],
  endpoint: Endpoint | null,
): ShapesState => {
  if (selectedShapeIds.length === 0) {
    return state;
  }
  const newShapes = new Map<string, Shape>(state.shapes);
  let shapesChanged = false;
  for (const shapeId of selectedShapeIds) {
    let shape = newShapes.get(shapeId);
    if (shape) {
      shape = shape.copy({ startEndpoint: endpoint });
      if (shape) {
        newShapes.set(shape.id, shape);
        shapesChanged = true;
      }
    }
  }
  if (shapesChanged) {
    return {
      ...state,
      shapes: newShapes,
    };
  }
  return state;
};

const updateSelectedFinishEndpoints = (
  state: ShapesState,
  selectedShapeIds: string[],
  endpoint: Endpoint | null,
): ShapesState => {
  if (selectedShapeIds.length === 0) {
    return state;
  }
  const newShapes = new Map<string, Shape>(state.shapes);
  let shapesChanged = false;
  for (const shapeId of selectedShapeIds) {
    let shape = newShapes.get(shapeId);
    if (shape) {
      shape = shape.copy({ finishEndpoint: endpoint });
      if (shape) {
        newShapes.set(shape.id, shape);
        shapesChanged = true;
      }
    }
  }
  if (shapesChanged) {
    return {
      ...state,
      shapes: newShapes,
    };
  }
  return state;
};

const updateSelectedFontProps = (
  state: ShapesState,
  selectedShapeIds: string[],
  fontProps: Partial<FontProps>,
): ShapesState => {
  if (selectedShapeIds.length === 0) {
    return state;
  }
  const newShapes = new Map<string, Shape>(state.shapes);
  let shapesChanged = false;
  for (const shapeId of selectedShapeIds) {
    let shape = newShapes.get(shapeId);
    if (shape) {
      shape = shape.copy({ textConfig: fontProps });
      if (shape) {
        newShapes.set(shape.id, shape);
        shapesChanged = true;
      }
    }
  }
  if (shapesChanged) {
    return {
      ...state,
      shapes: newShapes,
    };
  }
  return state;
};

const updateConnectionsDragStartSelection = (
  state: ShapesState,
  compromisedConnectionIds: string[],
): Map<string, Connection> => {
  if (compromisedConnectionIds.length === 0) {
    return state.connections;
  }
  const updatedConnections = new Map(state.connections);
  compromisedConnectionIds.map((id) => {
    updatedConnections.delete(id);
  });
  return updatedConnections;
};
