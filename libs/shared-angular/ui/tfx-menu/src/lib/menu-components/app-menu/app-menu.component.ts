import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMenu } from '../../classes/menu-classes';
import { AppMenuItem, MenuItem } from '../../classes/menu-item-classes';
import { PopupMenuRef } from '../../popup-menu/popup-menu-ref';
import { PopupMenuService } from '../../popup-menu/popup-menu.service';
import { MENU_ITEM_DATA } from '../../tfx-menu.tokens';

@Component({
  selector: 'tfx-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMenuComponent implements OnInit, OnDestroy {
  @Input() menu!: AppMenu;

  private injectors: Map<string, Injector> = new Map<string, Injector>();
  private menuRef: PopupMenuRef | null = null;
  private activeMenuItem: AppMenuItem | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private injector: Injector,
    private popupMenu: PopupMenuService
  ) {}

  ngOnInit(): void {
    this.menu.appMenuComponent = this;
    this.menu.subMenuControl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => {
        if (item) {
          this.openSubMenu(item as AppMenuItem);
        } else {
          this.closeSubMenu();
        }
      });
    this.menu.startStateMachine();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.injectors.clear();
    this.menu.stopStateMachine();
    this.menu.appMenuComponent = null;
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

  public openSubMenu(appMenuItem: AppMenuItem) {
    if (!appMenuItem.component) {
      return;
    }
    if (this.menuRef) {
      this.closeSubMenu();
    }
    this.activeMenuItem = appMenuItem;
    this.menuRef = this.popupMenu.openSubMenu(appMenuItem.subMenu, {
      associatedElement: appMenuItem.component.elementRef,
      positions: [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
      ],
      backdropClick: () => {
        this.menu.backdropClick();
        this.menuRef = null;
      },
    });
  }

  public closeSubMenu() {
    this.activeMenuItem?.subMenu.backdropClick();
    this.menuRef?.close();
    this.menuRef = null;
    this.activeMenuItem = null;
  }
}
