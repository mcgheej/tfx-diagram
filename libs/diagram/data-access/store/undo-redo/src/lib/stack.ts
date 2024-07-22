import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

export class Stack<T> {
  private buffer: T[] = [];
  private disabledSubject = new BehaviorSubject<boolean>(this.buffer.length === 0);
  disabled$ = this.disabledSubject.asObservable().pipe(distinctUntilChanged());

  get length(): number {
    return this.buffer.length;
  }

  constructor(private maxLength = 20, private name = 'unNamed') {}

  clear() {
    this.buffer = [];
    this.disabledSubject.next(true);
  }

  push(item: T): void {
    if (this.buffer.length >= this.maxLength) {
      this.buffer.shift();
    }
    this.buffer.push(item);
    this.disabledSubject.next(false);
  }

  pop(): T | undefined {
    const poppedState = this.buffer.pop();
    this.disabledSubject.next(this.buffer.length === 0);
    return poppedState;
  }

  peek(): T | undefined {
    const lastElementIdx = this.buffer.length - 1;
    if (this.buffer.length < 0) {
      return undefined;
    }
    return this.buffer[lastElementIdx];
  }
}
