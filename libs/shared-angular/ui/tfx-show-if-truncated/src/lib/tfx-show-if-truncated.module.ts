import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShowIfTruncatedDirective } from './show-if-truncated.directive';

@NgModule({
  imports: [CommonModule, MatTooltipModule],
  declarations: [ShowIfTruncatedDirective],
  exports: [ShowIfTruncatedDirective],
})
export class TfxShowIfTruncatedModule {}
