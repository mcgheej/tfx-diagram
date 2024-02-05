import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SettingsEffects } from './settings.effects';
import { settingsFeature } from './settings.feature';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(settingsFeature),
    EffectsModule.forFeature([SettingsEffects]),
  ],
})
export class SettingsModule {}
