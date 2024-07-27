import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { PagesModule } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { SettingsModule } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { SketchbookModule } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { TransformModule } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { UndoRedoModule } from '@tfx-diagram/diagram-data-access-store-undo-redo';
import { ColorsModule } from '@tfx-diagram/diagram/data-access/store/features/colors';
import { ControlFrameModule } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { ShapesModule } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { DiagramAppMenuModule } from '@tfx-diagram/diagram/ui/diagram-app-menu';
import { MousePositionModule } from '@tfx-diagram/diagram/ui/mouse-position';
import { PageRibbonModule } from '@tfx-diagram/diagram/ui/page-ribbon';
// import { PageSelectorModule } from '@tfx-diagram/diagram/ui/page-selector';
import { PageViewportModule } from '@tfx-diagram/diagram/ui/page-viewport';
import { RulersModule } from '@tfx-diagram/diagram/ui/rulers';
import { ShapeInspectorModule } from '@tfx-diagram/diagram/ui/shape-inspector';
import { ZoomControlModule } from '@tfx-diagram/diagram/ui/zoom-control';
import { MouseWheelModule } from '@tfx-diagram/diagram/util/mouse-wheel';
import {
  INITIAL_ZOOM_FACTOR,
  PRESET_ZOOM_FACTORS,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { PageSelectorComponent } from '@tfx-diagram/shared-angular/tfx-page-selector';
import { TfxAppBarModule } from '@tfx-diagram/shared-angular/ui/tfx-app-bar';
import { TfxColorPickerModule } from '@tfx-diagram/shared-angular/ui/tfx-color-picker';
import { TfxMenuModule } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { SketchbookViewComponent } from './components/sketchbook-view/sketchbook-view.component';
import { ShellComponent } from './shell/shell.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DiagramAppMenuModule,
    TfxMenuModule.forRoot(),
    TfxAppBarModule,
    MouseWheelModule,
    UndoRedoModule,
    SettingsModule,
    ShapesModule,
    SketchbookModule,
    PagesModule,
    TransformModule,
    ControlFrameModule,
    ColorsModule,
    PageViewportModule,
    RulersModule,
    PageSelectorComponent,
    // PageSelectorModule,
    PageRibbonModule,
    MatDialogModule,
    MousePositionModule,
    ZoomControlModule.forRoot({
      presetZoomFactors: [...PRESET_ZOOM_FACTORS],
      initialZoomFactor: INITIAL_ZOOM_FACTOR,
    }),
    TfxColorPickerModule,
    ShapeInspectorModule,
  ],
  declarations: [ShellComponent, SketchbookViewComponent],
  exports: [ShellComponent],
})
export class ShellModule {}
