import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[tfxEditTab]',
  standalone: true,
})
export class EditTabDirective {
  editCancel = output<void>();

  @HostListener('window:keydown.esc', ['$event'])
  onEscKey() {
    this.editCancel.emit();
  }
}
