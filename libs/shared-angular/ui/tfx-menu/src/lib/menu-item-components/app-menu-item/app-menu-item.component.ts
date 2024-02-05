import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AppMenuItem } from '../../classes/menu-item-classes';
import { MENU_ITEM_DATA } from '../../tfx-menu.tokens';

@Component({
  selector: 'tfx-app-menu-item',
  templateUrl: './app-menu-item.component.html',
  styleUrls: ['./app-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMenuItemComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MENU_ITEM_DATA) public appMenuItem: AppMenuItem,
    public elementRef: ElementRef
  ) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.appMenuItem.click();
  }

  @HostListener('mouseleave', ['$event']) onLeave() {
    this.appMenuItem.mouseLeave();
  }

  @HostListener('mouseenter', ['$event']) onEnter() {
    this.appMenuItem.mouseEnter();
  }

  ngOnInit(): void {
    this.appMenuItem.component = this;
  }

  ngOnDestroy(): void {
    this.appMenuItem.component = null;
  }
}
