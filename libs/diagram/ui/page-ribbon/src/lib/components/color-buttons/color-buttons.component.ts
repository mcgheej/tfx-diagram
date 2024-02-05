import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import { ColorRef } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ColorButtonsService } from './color-buttons.service';

@Component({
  selector: 'tfx-color-buttons',
  templateUrl: './color-buttons.component.html',
  styleUrls: ['./color-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorButtonsComponent {
  @Input() colors!: { lineColor: ColorRef; fillColor: ColorRef };

  @ViewChild('fill', { read: ElementRef }) fillColorButton!: ElementRef<HTMLElement>;
  @ViewChild('line', { read: ElementRef }) lineColorButton!: ElementRef<HTMLElement>;

  ColorMapRef = ColorMapRef;

  constructor(private service: ColorButtonsService) {}

  onFillColorClick() {
    if (this.colors) {
      this.service.openColorDialog(
        'Fill Color',
        this.fillColorButton.nativeElement,
        this.colors
      );
    }
  }

  onLineColorClick() {
    if (this.colors) {
      this.service.openColorDialog(
        'Line Color',
        this.lineColorButton.nativeElement,
        this.colors
      );
    }
  }
}
