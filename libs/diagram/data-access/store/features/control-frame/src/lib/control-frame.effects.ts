import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { arrangeObjects } from './effects-helpers/align-objects-or-shape-resize.effect';
import { anotherShapeOnPage } from './effects-helpers/another-shape-on-page.effect';
import { backspaceKeypress } from './effects-helpers/backspace-keypress.effect';
import { colorChange } from './effects-helpers/color-change.effect';
import { ctrlLeftButtonDown } from './effects-helpers/ctrl-left-button-down.effect';
import { deleteKeypress } from './effects-helpers/delete-keypress.effect';
import { deleteShapesOnPage } from './effects-helpers/delete-shapes-on-page.effects';
import { doubleClick } from './effects-helpers/double-click.effect';
import { dragEnd } from './effects-helpers/drag-end.effect';
import { dragMove } from './effects-helpers/drag-move/drag-move.effect';
import { dragStart } from './effects-helpers/drag-start/drag-start.effect';
import { duplicateShapesAdded } from './effects-helpers/duplicate-shapes-added.effect';
import { finishEndpointChange } from './effects-helpers/finish-endpoint-change.effect';
import { firstShapeOnPage } from './effects-helpers/first-shape-on-page.effect';
import { fontPropsChange } from './effects-helpers/font-props-change.effect';
import { frameChanged } from './effects-helpers/frame-change.effect';
import { groupClick } from './effects-helpers/group-click.effect';
import { highlightChange } from './effects-helpers/highlight-change.effect';
import { inverseSelection } from './effects-helpers/inverse-selection.effect';
import { leftButtonDown } from './effects-helpers/left-button-down.effect';
import { lineDashChange } from './effects-helpers/line-dash-change.effect';
import { lineWidthChange } from './effects-helpers/line-width-change.effect';
import { printableKeypress } from './effects-helpers/printable-keypress.effect';
import { selectAll } from './effects-helpers/select-all.effect';
import { startEndpointChange } from './effects-helpers/start-endpoint-change.effect';
import { ungroupClick } from './effects-helpers/ungroup-shapes.effect';

@Injectable()
export class ControlFrameEffects {
  selectAll$ = selectAll(this.actions$, this.store);
  inverseSelection$ = inverseSelection(this.actions$, this.store);

  duplicateShapesAdded$ = duplicateShapesAdded(this.actions$, this.store);
  deleteShapesOnPage$ = deleteShapesOnPage(this.actions$);

  alignObjectsOrShapeResize$ = arrangeObjects(this.actions$, this.store);

  highlightChange$ = highlightChange(this.actions$, this.store);
  frameChanged$ = frameChanged(this.actions$);

  leftButtonDown$ = leftButtonDown(this.actions$, this.store);
  ctrlLeftButtonDown$ = ctrlLeftButtonDown(this.actions$, this.store);
  doubleClick$ = doubleClick(this.actions$, this.store);

  dragStart$ = dragStart(this.actions$, this.store);
  dragMove$ = dragMove(this.actions$, this.store);
  dragEnd$ = dragEnd(this.actions$, this.store);

  firstShapeOnPage$ = firstShapeOnPage(this.actions$);
  anotherShapeOnPage$ = anotherShapeOnPage(this.actions$);

  colorChange$ = colorChange(this.actions$, this.store);
  lineDashChange$ = lineDashChange(this.actions$, this.store);
  lineWidthChange$ = lineWidthChange(this.actions$, this.store);
  startEndpointChange$ = startEndpointChange(this.actions$, this.store);
  finishEndpointChange$ = finishEndpointChange(this.actions$, this.store);
  fontPropsChange$ = fontPropsChange(this.actions$, this.store);

  printableKeyPress$ = printableKeypress(this.actions$, this.store);
  deleteKeypress$ = deleteKeypress(this.actions$, this.store);
  backspaceKeypress$ = backspaceKeypress(this.actions$, this.store);

  groupClick$ = groupClick(this.actions$, this.store);
  ungroupClick$ = ungroupClick(this.actions$, this.store);

  constructor(private actions$: Actions, private store: Store) {
    // TODO - needs cleanup
    // this.store.select(selectControlShapes).subscribe((shapes) => {
    //   const shapesArray: Shape[] = [];
    //   shapes.forEach((s) => shapesArray.push(s));
    //   console.log(shapesArray);
    // });
  }
}
