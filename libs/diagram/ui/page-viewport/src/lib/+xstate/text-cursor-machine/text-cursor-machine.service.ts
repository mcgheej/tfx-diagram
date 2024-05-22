import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Actor, createActor } from 'xstate5';
import { TextCursorEvents } from './text-cursor.events';
import { textCursorMachine } from './text-cursor.machine';

@Injectable()
export class TextCursorMachineService {
  private cursorStateSubject$ = new Subject<'visible' | 'hidden'>();
  cursorState$ = this.cursorStateSubject$.asObservable();

  private textCursorActor: Actor<typeof textCursorMachine> | undefined;

  start() {
    if (this.textCursorActor) {
      this.stop();
    }

    this.textCursorActor = createActor(textCursorMachine, {
      input: {
        showCursor: true,
      },
    });
    this.textCursorActor.start();
    this.textCursorActor.subscribe((snapshot) => {
      if (snapshot.context.showCursor) {
        this.cursorStateSubject$.next('visible');
      } else {
        this.cursorStateSubject$.next('hidden');
      }
    });
  }

  stop() {
    this.cursorStateSubject$.complete();
    if (this.textCursorActor) {
      this.textCursorActor.stop();
      this.textCursorActor = undefined;
    }
  }

  send(event: TextCursorEvents) {
    if (this.textCursorActor) {
      this.textCursorActor.send(event);
    }
  }
}
