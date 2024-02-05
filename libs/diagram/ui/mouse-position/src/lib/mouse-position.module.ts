import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MousePositionComponent } from './mouse-position/mouse-position.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MousePositionComponent],
  exports: [MousePositionComponent],
})
export class MousePositionModule {}
