import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FontSizeButtonService } from './font-size-button.service';

@Component({
  selector: 'tfx-font-size-button',
  templateUrl: './font-size-button.component.html',
  styleUrls: ['./font-size-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontSizeButtonComponent {
  @Input() fontSizePt!: number;
  @Output() reduceSizeClick = new EventEmitter<void>();
  @Output() increaseSizeClick = new EventEmitter<void>();

  @ViewChild('fontSize', { read: ElementRef }) fontSizeButton!: ElementRef<HTMLElement>;

  constructor(private service: FontSizeButtonService) {}

  onReduceSizeClick() {
    this.reduceSizeClick.emit();
  }

  onIncreaseSizeClick() {
    this.increaseSizeClick.emit();
  }

  onSizeClick() {
    if (this.fontSizePt) {
      this.service.openFontSizeDialog(this.fontSizeButton.nativeElement, this.fontSizePt);
    }
  }
}
