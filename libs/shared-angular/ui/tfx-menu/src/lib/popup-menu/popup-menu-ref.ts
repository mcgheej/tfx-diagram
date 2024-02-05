import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { MenuItem } from '../classes/menu-item-classes/menu-item';

export class PopupMenuRef {
  private resultSubject$ = new Subject<MenuItem>();
  private result$: Observable<MenuItem> = this.resultSubject$.asObservable();

  constructor(private overlayRef: OverlayRef) {}

  public close(): void {
    this.overlayRef.dispose();
    this.resultSubject$.complete();
  }

  public closeWithResult(result: MenuItem): void {
    this.resultSubject$.next(result);
    this.close();
  }

  public afterClosed(): Observable<MenuItem> {
    return this.result$;
  }
}
