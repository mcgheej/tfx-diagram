import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SubMenuItem } from '../../classes/menu-item-classes/sub-menu-item';
import { MENU_ITEM_DATA } from '../../tfx-menu.tokens';

@Component({
  selector: 'tfx-sub-menu-item',
  templateUrl: './sub-menu-item.component.html',
  styleUrls: ['./sub-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubMenuItemComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MENU_ITEM_DATA) public subMenuItem: SubMenuItem,
    public elementRef: ElementRef
  ) {}

  @HostListener('mouseenter') onEnter() {
    this.subMenuItem.mouseEnter();
  }

  @HostListener('mouseleave') onLeave() {
    this.subMenuItem.mouseLeave();
  }

  ngOnInit(): void {
    this.subMenuItem.component = this;
  }

  ngOnDestroy(): void {
    this.subMenuItem.component = null;
  }
}
