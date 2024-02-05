import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createMachine, interpret, MachineOptions } from 'xstate';
import { ctrlLeftButtonDown } from './actions/ctrl-left-button-down.x-action';
import { doubleClick } from './actions/double-click.x-action';
import { dragEnd } from './actions/drag-end.x-action';
import { dragMove } from './actions/drag-move.x-action';
import { dragStart } from './actions/drag-start.x-action';
import { leftButtonDown } from './actions/left-button-down.x-action';
import { roamMouseMove } from './actions/roam-mouse-move.x-action';
import { mouseMachineConfig, mouseMachineContext } from './mouse-machine.config';
import { MouseMachineEvents } from './mouse-machine.events';
import { MouseMachineContext } from './mouse-machine.schema';

@Injectable()
export class MouseMachineService {
  mouseMachineOptions: Partial<MachineOptions<MouseMachineContext, MouseMachineEvents>> = {
    actions: {
      doubleClick: doubleClick(this.store),
      roamMouseMove: roamMouseMove(this.store),
      leftButtonDown: leftButtonDown(this.store),
      ctrlLeftButtonDown: ctrlLeftButtonDown(this.store),
      dragStart: dragStart(this.store),
      dragMove: dragMove(this.store),
      dragEnd: dragEnd(this.store),
    },
  };

  private mouseMachine = createMachine<MouseMachineContext, MouseMachineEvents>(
    mouseMachineConfig()
  )
    .withConfig(this.mouseMachineOptions)
    .withContext(mouseMachineContext);

  private interpreter = interpret(this.mouseMachine);

  constructor(private store: Store) {}

  start() {
    if (this.interpreter.initialized) {
      this.interpreter.stop();
    }
    this.interpreter.start();
  }

  stop() {
    this.interpreter.stop();
  }

  send(event: MouseMachineEvents) {
    this.interpreter.send(event);
  }
}
