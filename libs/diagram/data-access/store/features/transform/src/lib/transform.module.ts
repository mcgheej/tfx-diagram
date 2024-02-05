import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TransformEffects } from './transform.effects';
import { transformFeature } from './transform.feature';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(transformFeature),
    EffectsModule.forFeature([TransformEffects]),
  ],
})
export class TransformModule {}
