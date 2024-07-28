import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tfxInputFocus]',
  standalone: true,
})
export class InputFocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const input = this.renderer.selectRootElement(
      this.elementRef.nativeElement
    ) as HTMLInputElement;
    input.focus();
    input.setSelectionRange(0, input.value.length);
  }
}
