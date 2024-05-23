import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actor, createActor } from 'xstate5';
import { MouseMachineEvents } from './mouse-machine.events';
import { mouseMachine } from './mouse-machine.machine';

@Injectable()
export class MouseMachineService {
  private mouseActor: Actor<typeof mouseMachine> | undefined;

  constructor(private store: Store) {}

  start() {
    if (this.mouseActor) {
      this.stop();
    }

    this.mouseActor = createActor(mouseMachine, {
      input: {
        store: this.store,
      },
    });
    this.mouseActor.start();
  }

  stop() {
    if (this.mouseActor) {
      this.mouseActor.stop();
      this.mouseActor = undefined;
    }
  }

  send(event: MouseMachineEvents) {
    if (this.mouseActor) {
      this.mouseActor?.send(event);
    }
  }
}
