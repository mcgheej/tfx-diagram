import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TfxIconButtonModule } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { TfxMenuModule } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { AppBarComponent } from './app-bar/app-bar.component';
import { ControlButtonsComponent } from './components/control-buttons/control-buttons.component';

@NgModule({
  imports: [CommonModule, TfxMenuModule, TfxIconButtonModule],
  declarations: [AppBarComponent, ControlButtonsComponent],
  exports: [AppBarComponent],
})
export class TfxAppBarModule {}
