import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { SketchbookStatus } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { createMachine, interpret, MachineOptions } from 'xstate';
import { openDialog, startClose } from './actions';
import { saveCloseConfig } from './save-close.config';
import { Closed, Closing, Modified, SaveCloseEvents, Saved } from './save-close.events';
import { SaveCloseContext } from './save-close.schema';

export type SaveCloseResult = 'closed' | 'cancelled';

@Injectable({ providedIn: 'root' })
export class SaveCloseMachineService {
  private saveCloseOptions: Partial<MachineOptions<SaveCloseContext, SaveCloseEvents>> = {
    actions: {
      startClose: startClose(this.store),
      openDialog: openDialog(this.store, this.dialog),
    },
  };

  private saveCloseMachine = createMachine<SaveCloseContext, SaveCloseEvents>(
    saveCloseConfig()
  ).withConfig(this.saveCloseOptions);

  private interpreter = interpret(this.saveCloseMachine);
  private statusSubscription: Subscription | null = null;
  private result$: ReplaySubject<SaveCloseResult> | null = null;

  constructor(private store: Store, private dialog: MatDialog) {}

  start(): Observable<SaveCloseResult> {
    if (this.interpreter.initialized) {
      this.interpreter.stop();
    }
    this.interpreter.start();

    this.cleanSubscriptions();
    this.statusSubscription = this.store.select(selectStatus).subscribe((status) => {
      this.sendStatusEvent(status);
    });
    if (this.result$) {
      this.result$.complete();
      this.result$ = null;
    }
    this.result$ = new ReplaySubject<SaveCloseResult>(1);

    this.interpreter.onTransition((state) => {
      if (state.changed && this.result$) {
        if (state.matches('closed')) {
          this.result$.next('closed');
          this.result$.complete();
        } else if (state.matches('cancelled')) {
          this.result$.next('cancelled');
          this.result$.complete();
        }
      }
    });
    return this.result$.asObservable();
  }

  stop() {
    this.cleanSubscriptions();
    this.interpreter.stop();
  }

  private cleanSubscriptions() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = null;
    }
  }

  private sendStatusEvent(status: SketchbookStatus) {
    switch (status) {
      case 'closed': {
        this.interpreter.send(new Closed());
        break;
      }
      case 'closing': {
        this.interpreter.send(new Closing());
        break;
      }
      case 'modified': {
        this.interpreter.send(new Modified());
        break;
      }
      case 'saved': {
        this.interpreter.send(new Saved());
        break;
      }
    }
  }
}
