import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import {
  MatLegacyTooltipDefaultOptions as MatTooltipDefaultOptions,
  MAT_LEGACY_TOOLTIP_DEFAULT_OPTIONS as MAT_TOOLTIP_DEFAULT_OPTIONS,
} from '@angular/material/legacy-tooltip';
import { Alignment } from '@tfx-diagram/electron-renderer-web/shared-types';
import { alignmentButtonConfigs } from './text-alignment-button-options';
import { TextOptionsDialogData, TextOptionsDialogDataProps } from './text-options-dialog.types';

// Do not want Mat Tooltip interactivity behaviour (doesn't hide tooltip when
// user moves mouse over tooltip). Set up own custom default and inject - need to
// do this here for this compnent as not child of Shell.
export const myCustomTooltipDefaults: Partial<MatTooltipDefaultOptions> = {
  disableTooltipInteractivity: true,
};

@Component({
  templateUrl: './text-options-dialog.component.html',
  styleUrls: ['./text-options-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }],
})
export class TextOptionsDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('topInput') topInputEl!: ElementRef;
  @ViewChild('rightInput') rightInputEl!: ElementRef;
  @ViewChild('bottomInput') bottomInputEl!: ElementRef;
  @ViewChild('leftInput') leftInputEl!: ElementRef;

  readonly buttonConfigs = alignmentButtonConfigs;

  activeIndex = 0;
  selectedAlignment: Alignment = { horizontal: 'left', vertical: 'top' };
  selectedPadding = { top: 0, right: 0, bottom: 0, left: 0 };

  constructor(
    private dialogRef: MatDialogRef<TextOptionsDialogComponent, TextOptionsDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: TextOptionsDialogDataProps
  ) {}

  ngOnInit(): void {
    if (this.data.alignment) {
      this.activeIndex = this.getAlignmentIndex(this.data.alignment);
      this.selectedAlignment = this.data.alignment;
    }
    if (this.data.mmPadding) {
      this.selectedPadding.top = this.data.mmPadding.top;
      this.selectedPadding.right = this.data.mmPadding.right;
      this.selectedPadding.bottom = this.data.mmPadding.bottom;
      this.selectedPadding.left = this.data.mmPadding.left;
    }
  }

  ngAfterViewInit(): void {
    if (this.topInputEl && this.rightInputEl && this.bottomInputEl && this.leftInputEl) {
      (this.topInputEl.nativeElement as HTMLInputElement).value =
        this.selectedPadding.top.toString();
      (this.rightInputEl.nativeElement as HTMLInputElement).value =
        this.selectedPadding.right.toString();
      (this.bottomInputEl.nativeElement as HTMLInputElement).value =
        this.selectedPadding.bottom.toString();
      (this.leftInputEl.nativeElement as HTMLInputElement).value =
        this.selectedPadding.left.toString();
    }
  }

  onAlignmentButtonClick(alignment: Alignment) {
    this.selectedAlignment = alignment;
    this.activeIndex = this.getAlignmentIndex(this.selectedAlignment);
  }

  onKeydown(ev: Event) {
    ev.stopPropagation();
  }

  onInput(pos: 'top' | 'right' | 'bottom' | 'left', ev: Event, inputEl: HTMLInputElement) {
    // If input is empty put a '0' in place
    if (inputEl.value === '') {
      inputEl.value = '0';
      this.selectedPadding[pos] = 0;
      return;
    }

    // If new character is not a digit reset input to previous
    // padding value. Check by matching all characters against
    // digits using regular expression
    if (!/^\d+$/.test(inputEl.value)) {
      inputEl.value = this.selectedPadding[pos].toString();
      console.log('Must be a digit');
      // TODO - put up toast to provide user feedback
      return;
    }

    // Check for a leading zero and remove if present
    if (inputEl.value[0] === '0' && inputEl.value.length > 1) {
      inputEl.value = inputEl.value.slice(1);
    }

    // Check value is in range 0 - 10. If not reset input to
    // previous padding value.
    if (+inputEl.value > 10) {
      inputEl.value = this.selectedPadding[pos].toString();
      console.log('Cannot be greater than 10mm');
      // TODO - Throw up toast to provide user feedback
      return;
    }
    this.selectedPadding[pos] = +inputEl.value;
  }

  onSaveClick() {
    let result: TextOptionsDialogData | undefined = undefined;
    if (this.alignmentChanged()) {
      result = { alignment: this.selectedAlignment };
      if (this.paddingChanged()) {
        result.mmPadding = this.selectedPadding;
      }
      this.dialogRef.close(result);
      return;
    }
    if (this.paddingChanged()) {
      this.dialogRef.close({
        mmPadding: this.selectedPadding,
      });
      return;
    }
    this.dialogRef.close();
  }

  private getAlignmentIndex(alignment: Alignment): number {
    const h = alignment.horizontal;
    const v = alignment.vertical;
    let activeIndex = h === 'left' ? 0 : h === 'center' ? 1 : 2;
    activeIndex += v === 'top' ? 0 : v === 'center' ? 3 : 6;
    return activeIndex;
  }

  private alignmentChanged(): boolean {
    if (this.data.alignment) {
      return (
        this.data.alignment.horizontal !== this.selectedAlignment.horizontal ||
        this.data.alignment.vertical !== this.selectedAlignment.vertical
      );
    }
    return true;
  }

  private paddingChanged(): boolean {
    if (this.data.mmPadding) {
      return (
        this.data.mmPadding.top !== this.selectedPadding.top ||
        this.data.mmPadding.right !== this.selectedPadding.right ||
        this.data.mmPadding.bottom !== this.selectedPadding.bottom ||
        this.data.mmPadding.left !== this.selectedPadding.left
      );
    }
    return true;
  }
}
