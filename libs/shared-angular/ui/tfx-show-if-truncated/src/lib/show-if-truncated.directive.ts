import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

// This directive taken from StackOverflow answer by Egor Kolesnikov -
// answer to question "Show Tooltip only when ellipsis is active"

@Directive({
  selector: '[matTooltip][tfxShowIfTruncated]',
})
export class ShowIfTruncatedDirective implements OnChanges {
  @Input() overrideTruncation = false;

  constructor(private matTooltip: MatTooltip, private elementRef: ElementRef) {
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      this.matTooltip.disabled =
        element.scrollWidth <= element.clientWidth || this.overrideTruncation;
    });
  }

  ngOnChanges(): void {
    if (this.elementRef) {
      const el = this.elementRef.nativeElement;
      this.matTooltip.disabled = el.scrollWidth <= el.clientWidth || this.overrideTruncation;
    }
  }
}
