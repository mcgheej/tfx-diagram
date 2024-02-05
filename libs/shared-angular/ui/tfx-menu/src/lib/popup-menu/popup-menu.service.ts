import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable, Injector } from '@angular/core';
import { PopupMenu } from '../classes/menu-classes/popup-menu';
import { SubMenuComponent } from '../menu-components/sub-menu/sub-menu.component';
import { POPUP_MENU_DATA } from '../tfx-menu.tokens';
import { PopupMenuRef } from './popup-menu-ref';

export interface PopupMenuComponentOptions {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  associatedElement?: ElementRef;
  positions?: ConnectedPosition[];
  backdropClick?: () => void;
}

export const DEFAULT_CONFIG: PopupMenuComponentOptions = {
  hasBackdrop: true,
  backdropClass: 'transparent-backdrop',
  panelClass: 'tm-menu-panel',
  positions: [
    {
      originX: 'center',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'bottom',
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class PopupMenuService {
  constructor(private injector: Injector, private overlay: Overlay) {}

  public openSubMenu(
    menu: PopupMenu,
    config: PopupMenuComponentOptions
  ): PopupMenuRef {
    const menuConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(menuConfig);
    const menuRef = new PopupMenuRef(overlayRef);
    this.attachSubMenuContainer(overlayRef, menu, menuRef);

    overlayRef.backdropClick().subscribe(() => {
      if (menuConfig.backdropClick) {
        menuConfig.backdropClick();
      } else {
        menuRef.close();
      }
    });
    return menuRef;
  }

  private createOverlay(config: PopupMenuComponentOptions): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachSubMenuContainer(
    overlayRef: OverlayRef,
    menu: PopupMenu,
    menuRef: PopupMenuRef
  ) {
    const injector = this.createInjector(menu, menuRef);
    const containerPortal = new ComponentPortal(
      SubMenuComponent,
      null,
      injector
    );
    const containerRef: ComponentRef<SubMenuComponent> = overlayRef.attach(
      containerPortal
    );
    return containerRef.instance;
  }

  private getOverlayConfig(config: PopupMenuComponentOptions): OverlayConfig {
    config.associatedElement = config.associatedElement ?? ({} as ElementRef);
    config.positions = config.positions ?? [];
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(config.associatedElement)
      .withViewportMargin(30)
      .withPositions(config.positions);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    return overlayConfig;
  }

  private createInjector(menu: PopupMenu, menuRef: PopupMenuRef): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: PopupMenuRef, useValue: menuRef },
        { provide: POPUP_MENU_DATA, useValue: menu },
      ],
    });
  }
}
