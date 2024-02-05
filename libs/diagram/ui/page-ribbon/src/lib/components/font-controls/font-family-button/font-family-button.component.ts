import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { FontFamilyButtonService } from './font-family-button.service';

@Component({
  selector: 'tfx-font-family-button',
  templateUrl: './font-family-button.component.html',
  styleUrls: ['./font-family-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontFamilyButtonComponent {
  @Input() fontFamily!: string;

  @ViewChild('family', { read: ElementRef }) fontFamilyButton!: ElementRef<HTMLElement>;

  constructor(private service: FontFamilyButtonService) {}

  onFontFamilyClick() {
    if (this.fontFamily) {
      this.service.openFontFamilyDialog(this.fontFamilyButton.nativeElement, this.fontFamily);
    }
  }
}
