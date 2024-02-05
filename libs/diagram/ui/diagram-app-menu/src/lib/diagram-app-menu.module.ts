import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@tfx-diagram/diagram/ui/material';
import { HotkeyModule } from 'angular2-hotkeys';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, HotkeyModule],
})
export class DiagramAppMenuModule {}
