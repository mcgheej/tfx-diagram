import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@tfx-diagram/diagram/ui/material';
import { SaveDiscardCancelDialogComponent } from './+xstate/save-discard-cancel-dialog/save-discard-cancel-dialog.component';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [SaveDiscardCancelDialogComponent],
})
export class FileSaveCloseXstateModule {}
