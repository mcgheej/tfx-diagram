import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[tfxEditTab]',
})
export class EditTabDirective {
  @Output() editCancel = new EventEmitter<void>();

  @HostListener('window:keydown.esc', ['$event'])
  onEscKey() {
    this.editCancel.emit();
  }
}
