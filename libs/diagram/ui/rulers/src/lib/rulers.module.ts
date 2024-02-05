import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BottomRulerCanvasDirective } from './bottom-ruler/bottom-ruler-canvas.directive';
import { BottomRulerComponent } from './bottom-ruler/bottom-ruler.component';
import { LeftRulerCanvasDirective } from './left-ruler/left-ruler-canvas.directive';
import { LeftRulerComponent } from './left-ruler/left-ruler.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    BottomRulerComponent,
    LeftRulerComponent,
    BottomRulerCanvasDirective,
    LeftRulerCanvasDirective,
  ],
  exports: [BottomRulerComponent, LeftRulerComponent],
})
export class RulersModule {}
