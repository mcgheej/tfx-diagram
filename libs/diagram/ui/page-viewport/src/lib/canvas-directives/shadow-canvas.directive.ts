import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Shape, nextInChain } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  selectPageViewport,
  selectTransform,
  selectViewportMouseCoords,
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
import {
  EDIT_TEXT_SHADOW_COLOR,
  Page,
  Size,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  Subject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

export interface ShadowMouseMoveEvent {
  x: number;
  y: number;
  shapeIdUnderMouse: string;
  shapeUnderMouse: Shape | undefined;
}

@Directive({
  selector: '[tfxShadowCanvas]',
})
export class ShadowCanvasDirective implements OnInit, OnDestroy {
  @Output() shadowMouseMove = new EventEmitter<ShadowMouseMoveEvent>();
  private destroy$ = new Subject<void>();

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
              if (!selectedShapeIds.includes(highlightedShapeId)) {
                this.drawShapes(highlightFrameStart, controlShapes, page.size, c, transform);
              }
              this.drawShapes(selectionFrameStart, controlShapes, page.size, c, transform);
              if (textEdit) {
                this.drawEditableText(textEdit, page.size, c, transform);
              }
            }
          }
        );

      this.store
        .select(selectViewportMouseCoords)
        .pipe(takeUntil(this.destroy$), withLatestFrom(this.store.select(selectShapes)))
        .subscribe(([{ x, y }, shapes]) => {
          let shadowColour = 0;
          const { data } = c.getImageData(x - 1, y - 1, 3, 3);
          shadowColour = data[2] + data[1] * 256 + data[0] * 65536;
          for (let i = 1; i < 9; i++) {
            if (
              data[i * 4] !== data[0] ||
              data[i * 4 + 1] !== data[1] ||
              data[i * 4 + 2] !== data[2] ||
              data[i * 4 + 3] !== data[3]
            ) {
              shadowColour = 0;
              break;
            }
          }
          const id = shadowColour === 0 ? '' : shadowColour.toString();
          this.shadowMouseMove.emit({
            x,
            y,
            shapeIdUnderMouse: id,
            shapeUnderMouse: shapes.get(id),
          });
        });
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
    let shape = nextInChain(firstShapeId, shapes);
    while (shape) {
      if (shape.selectable) {
        shape.drawShadow(c, t);
      }
      shape = nextInChain(shape.nextShapeId, shapes);
    }
    c.restore();
  }

  private drawEditableText(
    textEdit: TextEdit,
    pageSize: Size,
    c: CanvasRenderingContext2D,
    t: Transform
  ) {
    c.save();
    this.clipToPage(pageSize, c, t);
    // const fontSize = ((t.scaleFactor * textBlock.parentProps.fontSizePt) / 72) * 25.4;
    c.fillStyle = EDIT_TEXT_SHADOW_COLOR;
    // c.textAlign = 'left';
    // c.textBaseline = 'alphabetic';
    // c.font = `${fontSize}px ` + textBlock.parentProps.fontFamily;
    for (const rect of textEdit.shadowRects()) {
      c.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
    c.restore();
  }

  // TODO: this is replicated from diagram service - refactor to share
  // utility function
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
}
