import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Actor, createActor } from 'xstate5';
import { TextCursorEvents } from './text-cursor.events';
import { textCursorMachine } from './text-cursor.machine';

@Injectable()
export class TextCursorMachineService {
  private cursorStateSubject$ = new Subject<'visible' | 'hidden'>();
  cursorState$ = this.cursorStateSubject$.asObservable();

  // private textCursorActor: Actor<typeof textCursorMachine> | undefined;
  private textCursorActor: Actor<typeof textCursorMachine> = createActor(textCursorMachine, {
    input: {
      showCursor: true,
    },
  });

  start() {
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
    this.textCursorActor.stop();
    console.log(this.textCursorActor.getSnapshot());
  }

  send(event: TextCursorEvents) {
    this.textCursorActor.send(event);
  }
}
