import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { TfxColorPickerModule } from '@tfx-diagram/shared-angular/ui/tfx-color-picker';
import { TfxIconButtonModule } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { ColorButtonComponent } from './components/color-buttons/color-button.component';
import { ColorButtonsComponent } from './components/color-buttons/color-buttons.component';
import { ColorSquareComponent } from './components/color-buttons/color-dialog/cmps/color-square.component';
import { ColorSquaresRowComponent } from './components/color-buttons/color-dialog/cmps/color-squares-row.component';
import { CustomColorsComponent } from './components/color-buttons/color-dialog/cmps/custom-colors.component';
import { NoColorComponent } from './components/color-buttons/color-dialog/cmps/no-color.component';
import { StandardColorsComponent } from './components/color-buttons/color-dialog/cmps/standard-colors.component';
import { ThemeColorsComponent } from './components/color-buttons/color-dialog/cmps/theme-colors.component';
import { ThemeTintsComponent } from './components/color-buttons/color-dialog/cmps/theme-tints.component';
import { ColorDialogComponent } from './components/color-buttons/color-dialog/color-dialog.component';
import { ColorInputComponent } from './components/color-buttons/custom-color-dialog/cmps/color-input.component';
import { CustomColorDialogComponent } from './components/color-buttons/custom-color-dialog/custom-color-dialog.component';
import { EndpointButtonCanvasDirective } from './components/endpoint-buttons/endpoint-button-canvas.directive';
import { EndpointButtonsComponent } from './components/endpoint-buttons/endpoint-buttons.component';
import { EndpointDialogComponent } from './components/endpoint-buttons/endpoint-dialog/endpoint-dialog.component';
import { EndpointOptionComponent } from './components/endpoint-buttons/endpoint-dialog/endpoint-option.component';
import { FinishEndpointButtonComponent } from './components/endpoint-buttons/finish-endpoint-button/finish-endpoint-button.component';
import { StartEndpointButtonComponent } from './components/endpoint-buttons/start-endpoint-button/start-endpoint-button.component';
import { FontControlsComponent } from './components/font-controls/font-controls.component';
import { FontFamilyButtonComponent } from './components/font-controls/font-family-button/font-family-button.component';
import { FontFamilyDialogComponent } from './components/font-controls/font-family-button/font-family-dialog/font-family-dialog.component';
import { FontSizeButtonComponent } from './components/font-controls/font-size-button/font-size-button.component';
import { FontSizeDialogComponent } from './components/font-controls/font-size-button/font-size-dialog/font-size-dialog.component';
import { FontToggleButtonComponent } from './components/font-controls/font-toggle-button.component';
import { TextOptionsDialogComponent } from './components/font-controls/text-options/text-options-dialog/text-options-dialog.component';
import { LineButtonsComponent } from './components/line-buttons/line-buttons.component';
import { LineDashButtonComponent } from './components/line-buttons/line-dash-button/line-dash-button.component';
import { LineDashButtonCanvasDirective } from './components/line-buttons/line-dash-button/line-dash-button.directive';
import { DashOptionComponent } from './components/line-buttons/line-dash-button/line-dash-dialog/dash-option.component';
import { LineDashDialogComponent } from './components/line-buttons/line-dash-button/line-dash-dialog/line-dash-dialog.component';
import { LineWidthButtonComponent } from './components/line-buttons/line-width-button/line-width-button.component';
import { LineWidthButtonCanvasDirective } from './components/line-buttons/line-width-button/line-width-button.directive';
import { LineWidthDialogComponent } from './components/line-buttons/line-width-button/line-width-dialog/line-width-dialog.component';
import { WidthOptionComponent } from './components/line-buttons/line-width-button/line-width-dialog/width-option.component';
import { PageRibbonComponent } from './page-ribbon/page-ribbon.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    TfxIconButtonModule,
    TfxColorPickerModule,
  ],
  declarations: [
    PageRibbonComponent,
    ColorButtonsComponent,
    ColorButtonComponent,
    ColorDialogComponent,
    ColorSquareComponent,
    ColorSquaresRowComponent,
    ThemeColorsComponent,
    StandardColorsComponent,
    ThemeTintsComponent,
    CustomColorsComponent,
    NoColorComponent,
    CustomColorDialogComponent,
    ColorInputComponent,
    LineButtonsComponent,
    LineWidthButtonComponent,
    LineWidthButtonCanvasDirective,
    LineWidthDialogComponent,
    WidthOptionComponent,
    EndpointButtonsComponent,
    StartEndpointButtonComponent,
    FinishEndpointButtonComponent,
    EndpointButtonCanvasDirective,
    EndpointDialogComponent,
    EndpointOptionComponent,
    DashOptionComponent,
    LineDashDialogComponent,
    LineDashButtonComponent,
    LineDashButtonCanvasDirective,
    FontControlsComponent,
    FontToggleButtonComponent,
    FontSizeButtonComponent,
    FontSizeDialogComponent,
    FontFamilyButtonComponent,
    FontFamilyDialogComponent,
    TextOptionsDialogComponent,
  ],
  exports: [PageRibbonComponent],
})
export class PageRibbonModule {}
