import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TfxResizeObserverDirective } from './tfx-resize-observer.directive';

@NgModule({
  declarations: [TfxResizeObserverDirective],
  imports: [CommonModule],
  exports: [TfxResizeObserverDirective],
})
export class TfxResizeObserverModule {}
