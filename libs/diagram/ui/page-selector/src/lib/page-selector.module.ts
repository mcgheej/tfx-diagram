import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TfxIconButtonModule } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { TfxShowIfTruncatedModule } from '@tfx-diagram/shared-angular/ui/tfx-show-if-truncated';
import { PagePositionIndicatorComponent } from './components/page-position-indicator/page-position-indicator.component';
import { EditTabDirective } from './components/page-tab-input/edit-tab.directive';
import { InputFocusDirective } from './components/page-tab-input/input-focus.directive';
import { PageTabInputComponent } from './components/page-tab-input/page-tab-input.component';
import { PageTabComponent } from './components/page-tab/page-tab.component';
import { PageTabsOverflowButtonComponent } from './components/page-tabs-overflow-button/page-tabs-overflow-button.component';
import { PageTabsViewerComponent } from './components/page-tabs-viewer/page-tabs-viewer.component';
import { PageSelectorComponent } from './page-selector/page-selector.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSnackBarModule,
    TfxIconButtonModule,
    TfxShowIfTruncatedModule,
  ],
  declarations: [
    PagePositionIndicatorComponent,
    PageTabInputComponent,
    InputFocusDirective,
    EditTabDirective,
    PageTabComponent,
    PageTabsOverflowButtonComponent,
    PageTabsViewerComponent,
    PageSelectorComponent,
  ],
  exports: [PageSelectorComponent],
})
export class PageSelectorModule {}
