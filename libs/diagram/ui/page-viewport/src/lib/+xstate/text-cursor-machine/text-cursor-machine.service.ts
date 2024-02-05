import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { assign, createMachine, interpret, MachineOptions } from 'xstate';
import {
  textCursorMachineConfig,
  textCursorMachineContext,
} from './text-cursor-machine.config';
import { TextCursorMachineEvents } from './text-cursor-machine.events';
import { TextCursorMachineContext } from './text-cursor-machine.schema';

@Injectable()
export class TextCursorMachineService {
  private cursorStateSubject$ = new Subject<'visible' | 'hidden'>();
  cursorState$ = this.cursorStateSubject$.asObservable();

  private textCursorMachineOptions: Partial<
    MachineOptions<TextCursorMachineContext, TextCursorMachineEvents>
  > = {
    actions: {
      showCursor: assign<TextCursorMachineContext, TextCursorMachineEvents>(() => {
        return {
          showCursor: true,
        };
      }),
      hideCursor: assign<TextCursorMachineContext, TextCursorMachineEvents>(() => {
        return {
          showCursor: false,
        };
      }),
    },
  };

  private textCursorMachine = createMachine<TextCursorMachineContext, TextCursorMachineEvents>(
    textCursorMachineConfig()
  )
    .withConfig(this.textCursorMachineOptions)
    .withContext(textCursorMachineContext);

  private interpreter = interpret(this.textCursorMachine);

  start() {
    if (this.interpreter.initialized) {
      this.interpreter.stop();
    }
    this.interpreter.start();
    this.interpreter.onChange((context) => {
      if (context.showCursor) {
        this.cursorStateSubject$.next('visible');
      } else {
        this.cursorStateSubject$.next('hidden');
      }
    });
  }

  stop() {
    this.interpreter.stop();
  }

  send(event: TextCursorMachineEvents) {
    this.interpreter.send(event);
  }
}
