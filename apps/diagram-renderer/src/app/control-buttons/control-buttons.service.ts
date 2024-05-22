import { Injectable, NgZone } from '@angular/core';
import { SaveCloseMachineService } from '@tfx-diagram/diagram/ui/file-save-close-xstate';
import { IconButtonConfig } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { BehaviorSubject } from 'rxjs';
import * as ButtonConfigs from './control-buttons.config';

@Injectable({ providedIn: 'root' })
export class ControlButtonsService {
  /**
   * The public buttonConfigs$ observable property will emit
   * whenever the button configurations are modified by
   * changing window state.
   */
  private buttonConfigs: IconButtonConfig[] = [];
  private buttonConfigsSubject$ = new BehaviorSubject<IconButtonConfig[]>(this.buttonConfigs);
  buttonConfigs$ = this.buttonConfigsSubject$.asObservable();

  constructor(private zone: NgZone, private saveCloseMachine: SaveCloseMachineService) {
    // Listen for the window maximize event from the electron main
    // process and update buttons as required. Need to run handler in
    // NgZone to ensure change detection continues to function.
    window.electronApi.maximizeWindowEvent(() => {
      this.zone.run(() => {
        this.buttonConfigs = this.getButtonsWhenMaximized();
        this.buttonConfigsSubject$.next(this.buttonConfigs);
      });
    });

    // Listen for the window unmaximize event from the electron
    // main process and update buttons as required. Need to run handler in
    // NgZone to ensure change detection continues to function.
    window.electronApi.unmaximizeWindowEvent(() => {
      this.zone.run(() => {
        this.buttonConfigs = this.getButtonsWhenNotMaximized();
        this.buttonConfigsSubject$.next(this.buttonConfigs);
      });
    });

    // Application starts in maximized state
    // TODO - perhaps need a better mechanism that
    // reads the state of the window rather than assume
    // maximised
    this.buttonConfigs = this.getButtonsWhenMaximized();
    this.buttonConfigsSubject$.next(this.buttonConfigs);
  }

  processButtonClick(i: number): void {
    switch (this.buttonConfigs[i].id) {
      case 'minimize': {
        window.electronApi.minimizeWindow();
        break;
      }
      case 'restore-down': {
        window.electronApi.restoreDown();
        break;
      }
      case 'maximize': {
        window.electronApi.maximizeWindow();
        break;
      }
      case 'close': {
        this.processCloseButton();
        break;
      }
    }
  }

  processCloseButton() {
    this.saveCloseMachine.start().subscribe({
      next: (result) => {
        if (result === 'closed') {
          window.electronApi.closeWindow();
        }
      },
      complete: () => this.saveCloseMachine.stop(),
    });
  }

  /**
   *
   * @returns array of icon button configs
   *
   * When maximized the control buttons are 'minimize',
   * 'restore down' and 'close'
   */
  getButtonsWhenMaximized(): IconButtonConfig[] {
    return [
      { ...ButtonConfigs.minimizeButtonConfig },
      { ...ButtonConfigs.restoreDownButtonConfig },
      { ...ButtonConfigs.closeButtonConfig },
    ].slice();
  }

  /**
   *
   * @returns array of icon button configs
   *
   * When not restored down the control buttons are 'minimize',
   * 'maximise' and 'close'
   */
  getButtonsWhenNotMaximized(): IconButtonConfig[] {
    return [
      { ...ButtonConfigs.minimizeButtonConfig },
      { ...ButtonConfigs.maximizeButtonConfig },
      { ...ButtonConfigs.closeButtonConfig },
    ].slice();
  }
}
