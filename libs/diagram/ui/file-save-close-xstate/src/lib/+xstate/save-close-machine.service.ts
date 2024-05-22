import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { SketchbookStatus } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { Actor, createActor } from 'xstate5';
import { saveCloseMachine } from './save-close.machine';

export type SaveCloseResult = 'closed' | 'cancelled';

@Injectable({ providedIn: 'root' })
export class SaveCloseMachineService {
  private saveCloseActor: Actor<typeof saveCloseMachine> | undefined;
  private statusSubscription: Subscription | null = null;
  private result$: ReplaySubject<SaveCloseResult> | null = null;

  constructor(private store: Store, private dialog: MatDialog) {}

  start(): Observable<SaveCloseResult> {
    if (this.saveCloseActor) {
      this.stop();
    }

    this.result$ = new ReplaySubject<SaveCloseResult>(1);

    this.saveCloseActor = createActor(saveCloseMachine, {
      input: {
        store: this.store,
        dialog: this.dialog,
      },
    });
    this.saveCloseActor.start();

    this.saveCloseActor.subscribe((snapshot) => {
      if (this.result$) {
        if (snapshot.matches('closed')) {
          this.result$.next('closed');
          this.result$.complete();
        } else if (snapshot.matches('cancelled')) {
          this.result$.next('cancelled');
          this.result$.complete();
        }
      }
    });
    this.cleanSubscriptions();
    this.statusSubscription = this.store.select(selectStatus).subscribe((status) => {
      this.sendStatusEvent(status as SketchbookStatus);
    });

    return this.result$.asObservable();
  }

  stop() {
    this.cleanSubscriptions();
    if (this.saveCloseActor) {
      this.saveCloseActor.stop();
    }
    if (this.result$) {
      this.result$.complete();
      this.result$ = null;
    }
  }

  private cleanSubscriptions() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = null;
    }
  }

  private sendStatusEvent(status: SketchbookStatus) {
    if (this.saveCloseActor) {
      switch (status) {
        case 'closed': {
          this.saveCloseActor.send({ type: 'closed' });
          break;
        }
        case 'closing': {
          this.saveCloseActor.send({ type: 'closing' });
          break;
        }
        case 'modified': {
          this.saveCloseActor.send({ type: 'modified' });
          break;
        }
        case 'saved': {
          this.saveCloseActor.send({ type: 'saved' });
          break;
        }
      }
    }
  }
}
