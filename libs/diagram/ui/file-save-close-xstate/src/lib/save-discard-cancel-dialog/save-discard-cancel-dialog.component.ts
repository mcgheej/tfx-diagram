import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tfx-save-discard-cancel-dialog',
  template: `
    <h1 mat-dialog-title>Save</h1>
    <div mat-dialog-actions>
      <button mat-stroked-button [mat-dialog-close]="'save'">Save</button>
      <button mat-stroked-button [mat-dialog-close]="'discard'">Don't Save</button>
      <button mat-stroked-button [mat-dialog-close]="'cancel'" cdkFocusInitial>cancel</button>
    </div>
  `,
  // templateUrl: './save-discard-cancel-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveDiscardCancelDialogComponent {}
