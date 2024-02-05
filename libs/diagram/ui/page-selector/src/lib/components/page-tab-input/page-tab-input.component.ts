import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'tfx-page-tab-input',
  templateUrl: './page-tab-input.component.html',
  styleUrls: ['./page-tab-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTabInputComponent implements OnInit {
  @Input() pageName = 'Unknown';
  @Output() pageNameChange = new EventEmitter<string>();
  @Output() editCancel = new EventEmitter<void>();

  @ViewChild('inputField') inputField: ElementRef | null = null;

  editValue = '';
  inputControl!: UntypedFormControl;

  ngOnInit() {
    this.inputControl = new UntypedFormControl(this.pageName, Validators.required);
    this.editValue = this.pageName;
  }

  doInput() {
    if (this.inputField) {
      this.editValue = this.inputField.nativeElement.value;
    }
  }

  onChange() {
    if (this.inputControl.valid) {
      this.pageNameChange.emit(this.inputControl.value);
    }
  }

  cancelEdit() {
    this.editCancel.emit();
  }
}
