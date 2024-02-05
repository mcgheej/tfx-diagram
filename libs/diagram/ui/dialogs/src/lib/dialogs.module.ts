import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@tfx-diagram/diagram/ui/material';
import { NewDialogComponent } from './new-dialog/new-dialog.component';
import { JpegDialogComponent } from './jpeg-dialog/jpeg-dialog.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  declarations: [NewDialogComponent, JpegDialogComponent],
  exports: [NewDialogComponent, JpegDialogComponent],
})
export class DialogsModule {}
