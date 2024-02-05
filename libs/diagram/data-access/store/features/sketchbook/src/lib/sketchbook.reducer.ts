import { createReducer, on } from '@ngrx/store';
import {
  ColorButtonsServiceActions,
  ControlFrameEffectsActions,
  EndpointButtonsServiceActions,
  FileMenuActions,
  FontFamilyButtonServiceActions,
  FontSizeButtonServiceActions,
  LineDashButtonServiceActions,
  LineWidthButtonServiceActions,
  PagesEffectsActions,
  SaveCloseMachineActions,
  ShapesEffectsActions,
  ShellComponentActions,
  SketchbookEffectsActions,
  SketchbookViewComponentActions,
  TextOptionsServiceActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { SketchbookState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';

export const initialState: SketchbookState = {
  title: '',
  path: '',
  status: 'closed',
  dialogOpen: false,
  exportStatus: 'quiescent',
};

export const sketchbookReducer = createReducer(
  initialState,
  on(FileMenuActions.newSketchbookClick, (state) => {
    return {
      ...state,
      status: 'creating',
      dialogOpen: true,
    };
  }),
  on(FileMenuActions.newSketchbookCancel, (state) => {
    return {
      ...state,
      status: 'closed',
    };
  }),
  on(FileMenuActions.newSketchbookCreate, (state, { sketchbookTitle }) => {
    return {
      ...state,
      title: sketchbookTitle,
      path: '',
      status: 'modified',
    };
  }),
  on(FileMenuActions.openSketchbookClick, (state) => {
    return {
      ...state,
      status: 'loading',
    };
  }),
  on(SketchbookEffectsActions.openCancel, SketchbookEffectsActions.openError, (state) => {
    return {
      ...state,
      status: 'closed',
    };
  }),
  on(FileMenuActions.exportSketchbookClick, (state) => {
    return {
      ...state,
      exportStatus: 'requested',
    };
  }),
  on(ShellComponentActions.exportJpegClick, (state) => {
    return {
      ...state,
      dialogOpen: true,
    };
  }),
  on(ShellComponentActions.exportJpegConfirmed, (state) => {
    return {
      ...state,
      dialogOpen: false,
      exportStatus: 'exporting',
    };
  }),
  on(
    ShellComponentActions.exportJpegCancel,
    SketchbookEffectsActions.exportError,
    SketchbookEffectsActions.exportError,
    (state) => {
      return {
        ...state,
        dialogOpen: false,
        exportStatus: 'quiescent',
      };
    }
  ),
  on(
    SaveCloseMachineActions.saveStart,
    SketchbookViewComponentActions.addPageClick,
    ColorButtonsServiceActions.colorDialogOpening,
    LineWidthButtonServiceActions.lineWidthDialogOpening,
    LineDashButtonServiceActions.lineDashDialogOpening,
    EndpointButtonsServiceActions.endpointDialogOpening,
    FontSizeButtonServiceActions.fontSizeDialogOpening,
    FontFamilyButtonServiceActions.fontFamilyDialogOpening,
    TextOptionsServiceActions.textOptionsDialogOpening,
    (state) => {
      return {
        ...state,
        dialogOpen: true,
      };
    }
  ),
  on(
    SaveCloseMachineActions.saveClick,
    SaveCloseMachineActions.discardClick,
    SaveCloseMachineActions.cancelClick,
    FileMenuActions.newSketchbookCreate,
    FileMenuActions.newSketchbookCancel,
    SketchbookViewComponentActions.addPageCancel,
    ColorButtonsServiceActions.colorDialogClosed,
    LineWidthButtonServiceActions.lineWidthDialogClosed,
    LineDashButtonServiceActions.lineDashDialogClosed,
    EndpointButtonsServiceActions.endpointDialogClosed,
    FontSizeButtonServiceActions.fontSizeDialogClosed,
    FontFamilyButtonServiceActions.FontFamilyDialogClosed,
    TextOptionsServiceActions.textOptionsDialogClosed,
    (state) => {
      return {
        ...state,
        dialogOpen: false,
      };
    }
  ),
  on(SketchbookViewComponentActions.addPageConfirmed, (state) => {
    return {
      ...state,
      status: 'modified',
    };
  }),
  on(
    FileMenuActions.saveSketchbookClick,
    SaveCloseMachineActions.saveStart,
    SaveCloseMachineActions.saveClick,
    (state) => {
      return {
        ...state,
        status: 'saving',
      };
    }
  ),
  on(SketchbookEffectsActions.saveSuccess, (state, { result }) => {
    return {
      ...state,
      title: result.title,
      path: result.path,
      status: 'saved',
    };
  }),
  on(
    SketchbookEffectsActions.saveCancel,
    SketchbookEffectsActions.saveError,
    SaveCloseMachineActions.cancelClick,
    ShapesEffectsActions.firstShapeOnPage,
    ShapesEffectsActions.anotherShapeOnPage,
    ShapesEffectsActions.duplicatedShapesOnPage,
    ShapesEffectsActions.pasteShapesOnPage,
    ShapesEffectsActions.deleteShapesOnPage,
    ShapesEffectsActions.groupClick,
    ControlFrameEffectsActions.selectedShapesLineColorChange,
    ControlFrameEffectsActions.selectedShapesFillColorChange,
    ControlFrameEffectsActions.selectedShapesLineWidthChange,
    ControlFrameEffectsActions.selectedShapesStartEndpointChange,
    ControlFrameEffectsActions.selectedShapesFinishEndpointChange,
    (state) => {
      return {
        ...state,
        status: 'modified',
      };
    }
  ),
  on(SaveCloseMachineActions.closeStart, SaveCloseMachineActions.discardClick, (state) => {
    return {
      ...state,
      status: 'closing',
    };
  }),
  on(PagesEffectsActions.sketchbookClose, () => {
    return { ...initialState };
  }),
  on(PagesEffectsActions.openSuccess, (state, { fileData }) => {
    return {
      ...fileData.sketchbook,
      status: 'saved',
    };
  }),
  on(SketchbookViewComponentActions.deletePageClick, (state) => {
    return {
      ...state,
      status: 'modified',
    };
  }),
  on(SketchbookViewComponentActions.zoomChange, (state) => {
    return {
      ...state,
      status: 'modified',
    };
  }),
  on(SketchbookViewComponentActions.currentPageChange, (state) => {
    return {
      ...state,
      status: 'modified',
    };
  }),
  on(SketchbookViewComponentActions.pageOrderChange, (state) => {
    return {
      ...state,
      status: 'modified',
    };
  })
);
