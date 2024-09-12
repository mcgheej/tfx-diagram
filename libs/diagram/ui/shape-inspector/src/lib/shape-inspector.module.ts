import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@tfx-diagram/diagram/ui/material';
import { TfxIconButtonModule } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { ShapeContentComponent } from './components/shape-content.component';
import { ShapeTitleComponent } from './components/shape-title.component';
import { ShapeComponent } from './components/shape.component';
import { ShapesDrawChainComponent } from './components/shapes-draw-chain.component';
import { ShapeInspectorComponent } from './shape-inspector/shape-inspector.component';

@NgModule({
  imports: [CommonModule, MaterialModule, TfxIconButtonModule],
  declarations: [
    ShapeInspectorComponent,
    ShapesDrawChainComponent,
    ShapeComponent,
    ShapeTitleComponent,
    ShapeContentComponent,
  ],
  exports: [ShapeInspectorComponent],
})
export class ShapeInspectorModule {}
