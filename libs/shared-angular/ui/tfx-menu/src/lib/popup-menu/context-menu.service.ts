import { Injectable } from '@angular/core';
import { ContextMenu } from '../classes/menu-classes';
import { PopupMenuRef } from './popup-menu-ref';
import {
  PopupMenuComponentOptions,
  PopupMenuService,
} from './popup-menu.service';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private contextMenuRef: PopupMenuRef | null;

  constructor(private popupMenuService: PopupMenuService) {
    this.contextMenuRef = null;
  }

  public openContextMenu(
    menu: ContextMenu,
    config: PopupMenuComponentOptions
  ): PopupMenuRef {
    if (this.contextMenuRef) {
      this.contextMenuRef.close();
    }
    this.contextMenuRef = this.popupMenuService.openSubMenu(menu, {
      ...config,
      ...{
        hasBackdrop: true,
        backdropClick: () => {
          menu.backdropClick();
          this.contextMenuRef?.close();
          this.contextMenuRef = null;
        },
      },
    });
    return this.contextMenuRef;
  }
}
