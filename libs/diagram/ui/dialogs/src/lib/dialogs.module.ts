import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@tfx-diagram/diagram/ui/material';
import { JpegDialogComponent } from './jpeg-dialog/jpeg-dialog.component';
import { NewDialogComponent } from './new-dialog/new-dialog.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  declarations: [NewDialogComponent, JpegDialogComponent],
  exports: [NewDialogComponent, JpegDialogComponent],
})
export class DialogsModule {}
