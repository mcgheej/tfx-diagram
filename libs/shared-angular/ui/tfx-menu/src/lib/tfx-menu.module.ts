import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MenuBuilderService } from './menu-builder.service';
import { AppMenuComponent } from './menu-components/app-menu/app-menu.component';
import { ContextMenuComponent } from './menu-components/context-menu/context-menu.component';
import { PopupMenuComponent } from './menu-components/popup-menu/popup-menu.component';
import { SubMenuComponent } from './menu-components/sub-menu/sub-menu.component';
import { AppMenuItemComponent } from './menu-item-components/app-menu-item/app-menu-item.component';
import { CheckboxItemComponent } from './menu-item-components/checkbox-item/checkbox-item.component';
import { CommandItemComponent } from './menu-item-components/command-item/command-item.component';
import { SubMenuItemComponent } from './menu-item-components/sub-menu-item/sub-menu-item.component';

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [
    PopupMenuComponent,
    SubMenuComponent,
    AppMenuComponent,
    AppMenuItemComponent,
    CheckboxItemComponent,
    CommandItemComponent,
    SubMenuItemComponent,
    ContextMenuComponent,
  ],
  exports: [AppMenuComponent],
})
export class TfxMenuModule {
  static forRoot(): ModuleWithProviders<TfxMenuModule> {
    return {
      ngModule: TfxMenuModule,
      providers: [MenuBuilderService],
    };
  }
}
