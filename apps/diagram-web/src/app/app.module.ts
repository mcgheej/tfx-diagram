import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { undoRedoMetaReducer } from '@tfx-diagram/diagram-data-access-store-undo-redo';
import { ShellModule } from '@tfx-diagram/diagram/shell';
import { ELECTRON_API, ENVIRONMENT_ELECTRON } from '@tfx-diagram/diagram/util/app-tokens';
import { HotkeyModule } from 'angular2-hotkeys';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { webApi } from './wep-api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}, { metaReducers: [undoRedoMetaReducer] }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, connectInZone: true }),
    EffectsModule.forRoot([]),
    HotkeyModule.forRoot(),
    ShellModule,
  ],
  providers: [
    { provide: ELECTRON_API, useValue: webApi },
    { provide: ENVIRONMENT_ELECTRON, useValue: environment.electron },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
