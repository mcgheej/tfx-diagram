import { Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectTextCursorPosition } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { TextCursorMachineService } from '../+xstate/text-cursor-machine/text-cursor-machine.service';

@Directive({
  selector: '[tfxTextCursorCanvas]',
  providers: [TextCursorMachineService],
})
export class TextCursorCanvasDirective implements OnInit, OnDestroy {
  @Input() textEdit!: TextEdit;

  @HostBinding('style.height.px') height = 4;
  @HostBinding('style.width.px') width = 2;
  @HostBinding('style.left.px') left = 0;
  @HostBinding('style.top.px') top = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly element: ElementRef,
    private store: Store,
    private textCursorMachine: TextCursorMachineService
  ) {}

  ngOnInit(): void {
    const canvasEl = this.element.nativeElement as HTMLCanvasElement;
    const c = canvasEl.getContext('2d', {
      willReadFrequently: true,
    });
    if (c) {
      this.textCursorMachine.cursorState$.subscribe((state) => {
        if (state === 'visible') {
          c.fillStyle = '#000000';
          c.fillRect(0, 0, 2, this.height);
        } else {
          c.clearRect(0, 0, 2, this.height);
        }
      });
      this.textCursorMachine.start();
      this.store
        .select(selectTextCursorPosition)
        .pipe(
          takeUntil(this.destroy$),
          distinctUntilChanged((prev, curr) => {
            if (prev === null && curr === null) {
              return true;
            }
            if (prev === null || curr === null) {
              return false;
            }
            return prev.x === curr.x && prev.y === curr.y;
          })
        )
        .subscribe((position) => {
          const textBlock = this.textEdit.textBlock();
          if (position && textBlock) {
            this.left = position.x;
            this.top = position.y;
            this.height =
              textBlock.lines[0].fontBoundingBoxAscent +
              textBlock.lines[0].fontBoundingBoxDescent;
            canvasEl.height = this.height;
            this.textCursorMachine.send({ type: 'cursor.moved' });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.textCursorMachine.stop();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
