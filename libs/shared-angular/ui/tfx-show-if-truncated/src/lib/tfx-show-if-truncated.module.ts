import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { ShowIfTruncatedDirective } from './show-if-truncated.directive';

@NgModule({
  imports: [CommonModule, MatTooltipModule],
  declarations: [ShowIfTruncatedDirective],
  exports: [ShowIfTruncatedDirective],
})
export class TfxShowIfTruncatedModule {}
