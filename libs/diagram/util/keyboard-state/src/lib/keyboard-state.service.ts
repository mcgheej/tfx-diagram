import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { KeyboardStateServiceActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectTextEdit } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { TextCursorCommandCodes } from '@tfx-diagram/electron-renderer-web/shared-types';
import { distinctUntilChanged, filter, fromEvent, map, withLatestFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KeyboardStateService {
  private keyboardState: { [id: string]: boolean } = {};

  private keydown$ = fromEvent<KeyboardEvent>(document, 'keydown');

  private printableChar$ = this.keydown$
    .pipe(
      withLatestFrom(this.store.select(selectTextEdit)),
      filter(([event, textEdit]) => {
        if (textEdit === null || event.ctrlKey) {
          return false;
        }
        return this.printableCharacter(event.key);
      }),
      map(([event]) => {
        return event.key;
      })
    )
    .subscribe((key) =>
      this.store.dispatch(KeyboardStateServiceActions.printableCharPressed({ key }))
    );

  private textEditNavigate$ = this.keydown$
    .pipe(
      withLatestFrom(this.store.select(selectTextEdit)),
      filter(([, textEdit]) => textEdit !== null),
      map(([event]) => {
        let command: TextCursorCommandCodes = 'NoCommand';
        if (event.code === 'ArrowRight') {
          command = event.ctrlKey ? 'EndWord' : 'NextChar';
        } else if (event.code === 'ArrowLeft') {
          command = event.ctrlKey ? 'StartWord' : 'PrevChar';
        } else if (event.code === 'Home') {
          command = event.ctrlKey ? 'StartText' : 'StartLine';
        } else if (event.code === 'End') {
          command = event.ctrlKey ? 'EndText' : 'EndLine';
        } else if (event.code === 'ArrowUp') {
          command = 'UpLine';
        } else if (event.code === 'ArrowDown') {
          command = 'DownLine';
        } else if (event.code === 'Escape') {
          command = 'Escape';
        } else if (event.code === 'Enter') {
          command = 'Enter';
        } else if (event.code === 'Backspace') {
          command = 'Backspace';
        } else if (event.code === 'Delete') {
          command = 'Delete';
        }
        return { command, extendSelection: event.shiftKey };
      })
    )
    .subscribe(({ command, extendSelection }) => {
      if (command !== 'NoCommand') {
        if (command === 'Escape') {
          this.store.dispatch(KeyboardStateServiceActions.editTextChange({ shapeId: '' }));
        } else if (command === 'Enter') {
          this.store.dispatch(KeyboardStateServiceActions.printableCharPressed({ key: '\n' }));
        } else if (command === 'Backspace') {
          this.store.dispatch(KeyboardStateServiceActions.backspaceKeypress());
        } else if (command === 'Delete') {
          this.store.dispatch(KeyboardStateServiceActions.deleteKeypress());
        } else {
          this.store.dispatch(
            KeyboardStateServiceActions.navigateTextCursor({ command, extendSelection })
          );
        }
      }
    });

  private keydownCode$ = this.keydown$
    .pipe(
      map((event) => event.code),
      distinctUntilChanged((prev, curr) => {
        return this.keyboardState[curr];
      })
    )
    .subscribe((code) => {
      this.keyboardState[code] = true;
      // console.log(`keydown: [${code}]`);
    });

  private keyup$ = fromEvent<KeyboardEvent>(document, 'keyup').subscribe(({ code }) => {
    this.keyboardState[code] = false;
    // console.log(`keyup: [${code}]`);
  });

  constructor(private store: Store) {}

  reset(): void {
    this.keyboardState = {};
  }

  pressed(code: string): boolean {
    if (this.keyboardState[code]) {
      return true;
    }
    return false;
  }

  private printableCharacter(key: string): boolean {
    return /^(\w|\s|[`¬!"£$%^&*()-_=+[\]{};:'@#~,<.>/?|])$/.test(key);
  }
}
