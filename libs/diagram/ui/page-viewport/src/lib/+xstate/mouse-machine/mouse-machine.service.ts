import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actor, createActor } from 'xstate5';
import { MouseMachineEvents } from './mouse-machine.events';
import { mouseMachine } from './mouse-machine.machine';

@Injectable()
export class MouseMachineService {
  private mouseActor: Actor<typeof mouseMachine> = createActor(mouseMachine, {
    input: {
      store: this.store,
    },
  });

  constructor(private store: Store) {}

  start() {
    this.mouseActor.start();
  }

  stop() {
    this.mouseActor.stop();
  }

  send(event: MouseMachineEvents) {
    this.mouseActor.send(event);
  }
}
