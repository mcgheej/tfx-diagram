import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubMenu } from '../../classes/menu-classes';
import { PopupMenu } from '../../classes/menu-classes/popup-menu';
import { MenuItem, SubMenuItem } from '../../classes/menu-item-classes';
import { PopupMenuRef } from '../../popup-menu/popup-menu-ref';
import {
  FlexibleSubMenuPositioning,
  PopupMenuService,
} from '../../popup-menu/popup-menu.service';
import { MENU_ITEM_DATA } from '../../tfx-menu.tokens';

@Component({
  selector: 'tfx-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupMenuComponent implements OnInit, OnDestroy {
  @Input() menu!: PopupMenu;
  @Output() menuItemClick = new EventEmitter<MenuItem>();

  private childMenuRef: PopupMenuRef | null = null;
  private activeMenuItem: SubMenuItem | null = null;
  private injectors: Map<string, Injector> = new Map<string, Injector>();
  private destroy$ = new Subject<void>();

  constructor(private popupMenu: PopupMenuService, private injector: Injector) {}

  @HostListener('mouseenter') onEnter() {
    if (this.menu.type === 'subMenu') {
      (this.menu as SubMenu).parentMenu.overSubMenu();
    }
  }

  ngOnInit(): void {
    this.menu.subMenuControl$.pipe(takeUntil(this.destroy$)).subscribe((item) => {
      if (item) {
        this.openSubMenu(item as SubMenuItem);
      } else {
        this.closeSubMenu();
      }
    });
    this.menu.startStateMachine();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.injectors.clear();
    this.menu.stopStateMachine();
  }

  public getInjector(menuItem: MenuItem): Injector {
    let injector = this.injectors.get(menuItem.id);
    if (injector) {
      return injector;
    }
    injector = Injector.create({
      providers: [{ provide: MENU_ITEM_DATA, useValue: menuItem }],
      parent: this.injector,
    });
    this.injectors.set(menuItem.id, injector);
    return injector;
  }

  public openSubMenu(subMenuItem: SubMenuItem) {
    if (!subMenuItem.component) {
      return;
    }
    if (this.childMenuRef) {
      this.closeSubMenu();
    }
    this.activeMenuItem = subMenuItem;
    this.childMenuRef = this.popupMenu.openSubMenu(subMenuItem.subMenu, {
      hasBackdrop: false,
      positioning: {
        type: 'Flexible',
        associatedElement: subMenuItem.component.elementRef,
        positions: [
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
          },
        ],
      } as FlexibleSubMenuPositioning,
    });
  }

  public closeSubMenu() {
    this.activeMenuItem?.subMenu.backdropClick();
    this.childMenuRef?.close();
    this.childMenuRef = null;
    this.activeMenuItem = null;
  }
}
