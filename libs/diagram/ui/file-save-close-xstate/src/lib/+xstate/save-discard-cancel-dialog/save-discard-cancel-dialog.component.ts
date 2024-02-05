import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tfx-save-discard-cancel-dialog',
  templateUrl: './save-discard-cancel-dialog.component.html',
  styleUrls: ['./save-discard-cancel-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveDiscardCancelDialogComponent {}
