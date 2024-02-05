import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PagesEffects } from './pages.effects';
import { pagesFeature } from './pages.feature';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(pagesFeature),
    EffectsModule.forFeature([PagesEffects]),
  ],
})
export class PagesModule {}
