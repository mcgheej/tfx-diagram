import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FontControlsComponentActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import { FontProps } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ColorButtonsService } from '../color-buttons/color-buttons.service';
import { TextOptionsService } from './text-options/text-options.service';

@Component({
  selector: 'tfx-font-controls',
  templateUrl: './font-controls.component.html',
  styleUrls: ['./font-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontControlsComponent {
  @Input() fontProps!: FontProps;

  @ViewChild('text', { read: ElementRef }) textColorButton!: ElementRef<HTMLElement>;
  @ViewChild('textOptionsButton', { read: ElementRef })
  textOptionsButton!: ElementRef<HTMLElement>;

  ColorMapRef = ColorMapRef;

  textOptionsDialogOpen$ = this.textOptionsService.dialogOpen$;

  constructor(
    private store: Store,
    private service: ColorButtonsService,
    private textOptionsService: TextOptionsService
  ) {}

  onBoldToggleClick() {
    const fontWeight = this.fontProps.fontWeight === 'normal' ? 'bold' : 'normal';
    this.store.dispatch(
      FontControlsComponentActions.fontPropsChange({ props: { fontWeight } })
    );
  }

  onItalicToggleClick() {
    const fontStyle = this.fontProps.fontStyle === 'normal' ? 'italic' : 'normal';
    this.store.dispatch(FontControlsComponentActions.fontPropsChange({ props: { fontStyle } }));
  }

  onUnderlineToggleClick() {
    const underline = this.fontProps.underline ? false : true;
    this.store.dispatch(FontControlsComponentActions.fontPropsChange({ props: { underline } }));
  }

  onTextColorClick() {
    if (this.fontProps) {
      this.service.openColorDialog('Text Color', this.textColorButton.nativeElement, {
        textColor: this.fontProps.color,
      });
    }
  }

  onTextOptionsClick() {
    this.textOptionsService.openTextOptionsDialog(this.textOptionsButton.nativeElement, {
      mmPadding: this.fontProps.mmPadding,
      alignment: this.fontProps.alignment,
    });
  }

  onReduceSizeClick() {
    if (this.fontProps && this.fontProps.fontSizePt > 8) {
      this.store.dispatch(
        FontControlsComponentActions.fontPropsChange({
          props: { fontSizePt: this.fontProps.fontSizePt - 1 },
        })
      );
    }
  }

  onIncreaseSizeClick() {
    if (this.fontProps && this.fontProps.fontSizePt < 48) {
      this.store.dispatch(
        FontControlsComponentActions.fontPropsChange({
          props: { fontSizePt: this.fontProps.fontSizePt + 1 },
        })
      );
    }
  }
}
