import { ChangeDetectionStrategy, Component, HostListener, Inject } from '@angular/core';
import { CheckboxItem } from '../../classes/menu-item-classes';
import { MENU_ITEM_DATA } from '../../tfx-menu.tokens';

@Component({
  selector: 'tfx-checkbox-item',
  templateUrl: './checkbox-item.component.html',
  styleUrls: ['./checkbox-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxItemComponent {
  constructor(@Inject(MENU_ITEM_DATA) public menuItem: CheckboxItem) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.menuItem.click();
  }

  @HostListener('mouseenter') onEnter() {
    this.menuItem.mouseEnter();
  }

  @HostListener('mouseleave') onLeave() {
    this.menuItem.mouseLeave();
  }
}
