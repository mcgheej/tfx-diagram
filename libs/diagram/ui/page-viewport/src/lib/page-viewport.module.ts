import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TfxResizeObserverModule } from '@tfx-diagram/shared-angular/ui/tfx-resize-observer';
import { TfxScrollbarModule } from '@tfx-diagram/shared-angular/ui/tfx-scrollbar';
import { DiagramCanvasDirective } from './canvas-directives/diagram-canvas.directive';
import { PageCanvasDirective } from './canvas-directives/page-canvas.directive';
import { ShadowCanvasDirective } from './canvas-directives/shadow-canvas.directive';
import { TextCursorCanvasDirective } from './canvas-directives/text-cursor-canvas.directive';
import { PageViewportComponent } from './page-viewport/page-viewport.component';

@NgModule({
  imports: [CommonModule, TfxScrollbarModule, TfxResizeObserverModule],
  declarations: [
    PageViewportComponent,
    PageCanvasDirective,
    DiagramCanvasDirective,
    ShadowCanvasDirective,
    TextCursorCanvasDirective,
  ],
  exports: [PageViewportComponent],
})
export class PageViewportModule {}
