import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ShapesEffects } from './shapes.effects';
import { shapesFeature } from './shapes.feature';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(shapesFeature),
    EffectsModule.forFeature([ShapesEffects]),
  ],
})
export class ShapesModule {}
