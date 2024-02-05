import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TfxResizeObserverModule } from '@tfx-diagram/shared-angular/ui/tfx-resize-observer';
import { ScrollbarComponent } from './scrollbar/scrollbar.component';

@NgModule({
  imports: [CommonModule, TfxResizeObserverModule],
  declarations: [ScrollbarComponent],
  exports: [ScrollbarComponent],
})
export class TfxScrollbarModule {}
