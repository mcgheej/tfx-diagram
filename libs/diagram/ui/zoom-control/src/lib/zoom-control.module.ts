import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TfxIconButtonModule } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { TfxMenuModule } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { ZoomControlService } from './zoom-control.service';
import { ZOOM_DATA } from './zoom-control.tokens';
import { ZoomControlConfig } from './zoom-control.types';
import { ZoomControlComponent } from './zoom-control/zoom-control.component';
import { ZoomSharedDataService } from './zoom-shared-data.service';

@NgModule({
  imports: [CommonModule, TfxMenuModule, TfxIconButtonModule],
  declarations: [ZoomControlComponent],
  exports: [ZoomControlComponent],
})
export class ZoomControlModule {
  static forRoot(config: ZoomControlConfig): ModuleWithProviders<ZoomControlModule> {
    return {
      ngModule: ZoomControlModule,
      providers: [
        { provide: ZOOM_DATA, useValue: config },
        ZoomSharedDataService,
        ZoomControlService,
      ],
    };
  }
}
