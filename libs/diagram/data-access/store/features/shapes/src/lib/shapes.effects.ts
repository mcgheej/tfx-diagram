import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { alignObjects } from './effects-helpers/align-objects.effect';
import { bringItemForward } from './effects-helpers/bring-item-forward.effect';
import { bringToFront } from './effects-helpers/bring-to-front.effect';
import { deleteShapes } from './effects-helpers/delete-shapes.effect';
import { distributeObjects } from './effects-helpers/distribute-objects.effect';
import { duplicateShapes } from './effects-helpers/duplicate-shapes.effect';
import { groupShapes } from './effects-helpers/group-shapes.effects';
import { insertShape } from './effects-helpers/insert-shape.effect';
import { pasteShapes } from './effects-helpers/paste-shapes.effect';
import { sendItemBackward } from './effects-helpers/send-item-backward.effect';
import { sendToBack } from './effects-helpers/send-to-back.effect';
import { shapeResizeClick } from './effects-helpers/shape-resize-click.effect';
import { textInsertPosition } from './effects-helpers/text-insert-position.effect';
import { ungroupShapes } from './effects-helpers/ungroup-shapes.effect';

@Injectable()
export class ShapesEffects {
  insertShape$ = insertShape(this.actions$, this.store);
  duplicateShapes$ = duplicateShapes(this.actions$, this.store);
  pasteShapes$ = pasteShapes(this.actions$, this.store);
  deleteShapes$ = deleteShapes(this.actions$, this.store);
  alignObjects$ = alignObjects(this.actions$, this.store);
  distributeObjects$ = distributeObjects(this.actions$, this.store);
  bringToFront$ = bringToFront(this.actions$, this.store);
  sendToBack$ = sendToBack(this.actions$, this.store);
  bringItemForward$ = bringItemForward(this.actions$, this.store);
  sendItemBackward$ = sendItemBackward(this.actions$, this.store);
  shapeResizeClick$ = shapeResizeClick(this.actions$, this.store);
  groupShapes$ = groupShapes(this.actions$, this.store);
  ungroupShapes$ = ungroupShapes(this.actions$, this.store);
  textInsertPosition$ = textInsertPosition(this.actions$);
  constructor(private actions$: Actions, private store: Store) {
    // TODO - needs cleanup
    // this.store.select(selectShapes).subscribe((shapes) => {
    //   console.log([...shapes.values()]);
    // });
    // this.store.select(selectCopyBuffer).subscribe((b) => console.log(b));
    // this.store
    //   .select(selectConnectionObjects)
    //   .subscribe((connections) => console.log(connections));
    // this.store
    //   .select(selectMovingConnectionIds)
    //   .subscribe((connectionIds) => console.log(connectionIds));
  }
}
