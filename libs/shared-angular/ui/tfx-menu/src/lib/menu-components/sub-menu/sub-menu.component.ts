import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SubMenu } from '../../classes/menu-classes/sub-menu';
import { MenuItem } from '../../classes/menu-item-classes/menu-item';
import { PopupMenuRef } from '../../popup-menu/popup-menu-ref';
import { POPUP_MENU_DATA } from '../../tfx-menu.tokens';

@Component({
  selector: 'tfx-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubMenuComponent implements OnInit, OnDestroy {
  constructor(
    public menuRef: PopupMenuRef,
    @Inject(POPUP_MENU_DATA) public menu: SubMenu
  ) {}

  ngOnInit(): void {
    this.menu.subMenuComponent = this;
  }

  ngOnDestroy(): void {
    this.menu.subMenuComponent = null;
  }

  public closeContextMenu() {
    this.menuRef.close();
  }

  public closeContextMenuWithResult(item: MenuItem) {
    this.menuRef.closeWithResult(item);
  }
}
