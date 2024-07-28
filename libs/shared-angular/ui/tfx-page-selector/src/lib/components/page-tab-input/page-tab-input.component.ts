import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { EditTabDirective } from './edit-tab.directive';
import { InputFocusDirective } from './input-focus.directive';

@Component({
  selector: 'tfx-page-tab-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditTabDirective, InputFocusDirective],
  templateUrl: './page-tab-input.component.html',
  styleUrl: './page-tab-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTabInputComponent implements OnInit {
  pageName = input('Unknown');
  pageNameChange = output<string>();
  editCancel = output<void>();

  @ViewChild('inputField') inputField: ElementRef | null = null;

  editValue = '';
  inputControl!: UntypedFormControl;

  ngOnInit() {
    this.inputControl = new UntypedFormControl(this.pageName(), Validators.required);
    this.editValue = this.pageName();
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
