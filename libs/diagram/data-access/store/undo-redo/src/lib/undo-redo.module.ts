import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { undoRedoFeature } from './undo-redo.feature';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(undoRedoFeature)],
})
export class UndoRedoModule {}
