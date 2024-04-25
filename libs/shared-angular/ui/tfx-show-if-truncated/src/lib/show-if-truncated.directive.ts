import { Directive, ElementRef } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

// This directive taken from StackOverflow answer by Egor Kolesnikov -
// answer to question "Show Tooltip only when ellipsis is active"

@Directive({
  selector: '[matTooltip][tfxShowIfTruncated]',
})
export class ShowIfTruncatedDirective {
  constructor(private matTooltip: MatTooltip, private elementRef: ElementRef) {
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      this.matTooltip.disabled = element.scrollWidth <= element.clientWidth;
    });
  }
}
