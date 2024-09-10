import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Group, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { DiagramCanvasDirectiveActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  selectPageViewport,
  selectTransform,
} from '@tfx-diagram/diagram-data-access-store-features-transform';
import {
  selectControlShapes,
  selectHighlightFrameStart,
  selectHighlightedShapeId,
  selectSelectedShapeIds,
  selectSelectionFrameStart,
  selectTextEdit,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { Page, Size, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  Subject,
  combineLatest,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  takeUntil,
  throttleTime,
  withLatestFrom,
} from 'rxjs';

@Directive({
  selector: '[tfxDiagramCanvas]',
})
export class DiagramCanvasDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(throttleTime(50));

  private firstShapeId$ = this.store.select(selectCurrentPage).pipe(
    filter((page) => page !== null),
    map((page) => (page as Page).firstShapeId),
    distinctUntilChanged()
  );

  constructor(private readonly element: ElementRef, private store: Store) {}

  ngOnInit(): void {
    const c = (this.element.nativeElement as HTMLCanvasElement).getContext('2d', {
      willReadFrequently: true,
    });
    if (c) {
      this.mouseMove$
        .pipe(takeUntil(this.destroy$))
        .subscribe((event) => this.onMouseMove(event));

      combineLatest([
        this.store.select(selectShapes),
        this.store.select(selectTransform),
        this.firstShapeId$,
      ])
        .pipe(
          withLatestFrom(
            this.store.select(selectHighlightFrameStart),
            this.store.select(selectSelectionFrameStart),
            this.store.select(selectSelectedShapeIds),
            this.store.select(selectHighlightedShapeId),
            this.store.select(selectPageViewport),
            this.store.select(selectCurrentPage),
            this.store.select(selectControlShapes),
            this.store.select(selectTextEdit)
          ),
          takeUntil(this.destroy$)
        )
        .subscribe(
          ([
            [shapes, transform, firstShapeId],
            highlightFrameStart,
            selectionFrameStart,
            selectedShapeIds,
            highlightedShapeId,
            viewport,
            page,
            controlShapes,
            textEdit,
          ]) => {
            if (page && shapes && transform && viewport) {
              c.clearRect(0, 0, viewport.width, viewport.height);
              this.drawShapes(firstShapeId, shapes, page.size, c, transform);
              if (textEdit) {
                this.drawEditableText(textEdit, page.size, c, transform);
              }
              if (
                !selectedShapeIds.includes(
                  Group.topLevelGroupIdFromId(highlightedShapeId, shapes)
                )
              ) {
                this.drawShapes(highlightFrameStart, controlShapes, page.size, c, transform);
              }
              this.drawShapes(selectionFrameStart, controlShapes, page.size, c, transform);
            }
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private drawShapes(
    firstShapeId: string,
    shapes: Map<string, Shape>,
    pageSize: Size,
    c: CanvasRenderingContext2D,
    t: Transform
  ) {
    c.save();
    this.clipToPage(pageSize, c, t);
    let shape = shapes.get(firstShapeId);
    while (shape) {
      shape.draw(c, t);
      shape = shapes.get(shape.nextShapeId);
    }
    c.restore();
  }

  private drawEditableText(
    textEdit: TextEdit,
    pageSize: Size,
    c: CanvasRenderingContext2D,
    t: Transform
  ) {
    const textBlock = textEdit.textBlock();
    if (textBlock) {
      c.save();
      this.clipToPage(pageSize, c, t);
      const selectionRects = textEdit.textSelectionRects();
      c.fillStyle = '#A9DDF3';
      for (const r of selectionRects) {
        c.fillRect(r.x, r.y, r.width, r.height);
      }
      textBlock.draw(c, t);
      c.restore();
      this.store.dispatch(
        DiagramCanvasDirectiveActions.textCursorPositionChange({
          position: textEdit.cursorPosition(),
        })
      );
    }
  }

  private clipToPage(pageSize: Size, c: CanvasRenderingContext2D, t: Transform) {
    c.beginPath();
    c.rect(
      t.scaleFactor * t.transX,
      t.scaleFactor * t.transY,
      t.scaleFactor * pageSize.width,
      t.scaleFactor * pageSize.height
    );
    c.clip();
  }

  private onMouseMove(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target instanceof Element) {
      if ((e.target as Element) === this.element.nativeElement) {
        this.store.dispatch(
          DiagramCanvasDirectiveActions.mouseMoveOnViewport({
            coords: {
              x: e.offsetX,
              y: e.offsetY,
            },
          })
        );
      }
    }
  }
}
