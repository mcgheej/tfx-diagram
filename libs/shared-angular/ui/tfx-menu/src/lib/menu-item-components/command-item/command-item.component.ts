import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit } from '@angular/core';
import { CommandItem } from '../../classes/menu-item-classes';
import { MENU_ITEM_DATA } from '../../tfx-menu.tokens';

@Component({
  selector: 'tfx-command-item',
  templateUrl: './command-item.component.html',
  styleUrls: ['./command-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandItemComponent implements OnInit {
  constructor(@Inject(MENU_ITEM_DATA) public menuItem: CommandItem) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.menuItem.click();
  }

  @HostListener('mouseleave', ['$event']) onLeave() {
    this.menuItem.mouseLeave();
  }

  @HostListener('mouseenter', ['$event']) onEnter() {
    this.menuItem.mouseEnter();
  }

  ngOnInit(): void {
    this.menuItem.component = this;
  }
}
