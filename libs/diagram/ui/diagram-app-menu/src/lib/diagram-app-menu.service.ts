import { Inject, Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SaveCloseMachineService } from '@tfx-diagram/diagram/ui/file-save-close-xstate';
import { ZoomControlService } from '@tfx-diagram/diagram/ui/zoom-control';
import { ENVIRONMENT_ELECTRON } from '@tfx-diagram/diagram/util/app-tokens';
import { AppMenu, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { HotkeysService } from 'angular2-hotkeys';
import { Subject } from 'rxjs';
import { ArrangeMenu } from './arrange-menu/arrange-menu';
import { EditMenu } from './edit-menu/edit-menu';
import { FileMenu } from './file-menu/file-menu';
import { HelpMenu } from './help-menu/help-menu';
import { InsertMenu } from './insert-menu/insert-menu';
import { SelectionMenu } from './selection-menu/selection-menu';
import { ViewMenu } from './view-menu/view-menu';

@Injectable({ providedIn: 'root' })
export class DiagramAppMenuService implements OnDestroy {
  private cmdsSubject$ = new Subject<string>();
  cmds$ = this.cmdsSubject$.asObservable();

  private fileMenu = new FileMenu(
    this.mb,
    this.store,
    this.dialog,
    this.environmentElectron,
    this.cmdsSubject$,
    this.saveCloseMachine
  );
  private editMenu = new EditMenu(this.mb, this.store, this.hotkeysService);
  private selectionMenu = new SelectionMenu(this.mb, this.store, this.hotkeysService);
  private viewMenu = new ViewMenu(this.mb, this.store, this.hotkeysService, this.zoomService);
  private insertMenu = new InsertMenu(this.mb, this.store);
  private arrangeMenu = new ArrangeMenu(this.mb, this.store, this.hotkeysService);
  private helpMenu = new HelpMenu(this.mb, this.store, this.dialog);

  private appMenu = this.mb.appMenu(
    {
      id: 'app-menu',
      appMenuItems: [
        this.mb.appMenuItem(this.fileMenu.getItem()),
        this.mb.appMenuItem(this.editMenu.getItem()),
        this.mb.appMenuItem(this.selectionMenu.getItem()),
        this.mb.appMenuItem(this.viewMenu.getItem()),
        this.mb.appMenuItem(this.insertMenu.getItem()),
        this.mb.appMenuItem(this.arrangeMenu.getItem()),
        this.mb.appMenuItem(this.helpMenu.getItem()),
      ],
    },
    {
      itemTextColor: '#ffffff',
      itemBackgroundColor: '#3f51b5',
      itemHighlightColor: '#283593',
    }
  );

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private dialog: MatDialog,
    private saveCloseMachine: SaveCloseMachineService,
    private hotkeysService: HotkeysService,
    private zoomService: ZoomControlService,
    @Inject(ENVIRONMENT_ELECTRON) private environmentElectron: boolean
  ) {}

  ngOnDestroy() {
    this.fileMenu.cleanup();
    this.editMenu.cleanup();
    this.selectionMenu.cleanup();
    this.viewMenu.cleanup();
    this.insertMenu.cleanup();
    this.arrangeMenu.cleanup();
    this.helpMenu.cleanup();
  }

  getAppMenu(): AppMenu {
    return this.appMenu;
  }
}
