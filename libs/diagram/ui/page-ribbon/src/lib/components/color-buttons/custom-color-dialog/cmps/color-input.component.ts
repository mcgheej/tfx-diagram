import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'tfx-color-input',
  template: `
    <div class="input-container">
      <div class="label">{{ label }}:</div>
      <input
        id="value"
        class="input"
        type="text"
        [formControl]="valueInput"
        autocomplete="off"
      />
    </div>
  `,
  styles: [
    `
      .input-container {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-columns: 75px 50px;
        grid-template-rows: 1fr;
      }

      .label {
        align-self: center;
        justify-self: right;
        padding-right: 5px;
      }

      .input {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        text-align: right;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorInputComponent implements OnInit, OnChanges, OnDestroy {
  @Input() label = '';
  @Input() initialValue = 0;
  @Input() min = 0;
  @Input() max = 100;
  @Output() valueChanges = new EventEmitter<number>();

  valueInput!: UntypedFormControl;

  value = '0';
  private prevValue = '0';
  private outputValue$ = new Subject<number>();

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.outputValue$.pipe(takeUntil(this.destroy$), debounceTime(1000)).subscribe((value) => {
      this.valueChanges.emit(value);
    });
    this.value = Math.round(this.initialValue).toString();
    this.prevValue = this.value;
    this.valueInput = new UntypedFormControl(this.value);
    this.valueInput.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const v = this.valueInput.value;
      if (v !== this.prevValue) {
        this.value = this.checkValue(v, this.prevValue);
        if (this.value !== this.prevValue) {
          this.prevValue = this.value;
          this.outputValue$.next(+this.value);
        }
      }
    });
  }

  ngOnChanges(): void {
    if (this.valueInput) {
      this.value = Math.round(this.initialValue).toString();
      this.prevValue = this.value;
      this.valueInput.setValue(this.value);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkValue(newValue: string, prevValue: string): string {
    if (newValue !== '') {
      if (newValue.match(/^(0|[1-9][0-9]*)$/)) {
        const v = +newValue;
        if (v < this.min || v > this.max) {
          // is number without leading zeros but out of range
          this.valueInput.setValue(prevValue);
          return prevValue;
        } else {
          // is number without leading zeros and in range
          return newValue;
        }
      } else {
        // is not number or has leading zero
        this.valueInput.setValue(prevValue);
        return prevValue;
      }
    } else {
      // input field empty - restore previous value
      this.valueInput.setValue(prevValue);
      return prevValue;
    }
  }
}
