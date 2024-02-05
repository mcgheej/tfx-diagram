import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectPageViewport } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tfx-bottom-ruler',
  templateUrl: './bottom-ruler.component.html',
  styleUrls: ['./bottom-ruler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomRulerComponent implements AfterViewInit, OnDestroy {
  rulerWidth = 300;
  readonly rulerHeight = 16;

  private subscription: Subscription | null = null;

  constructor(private changeDetect: ChangeDetectorRef, private store: Store) {}

  ngAfterViewInit(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.store.select(selectPageViewport).subscribe((viewport) => {
      if (viewport && viewport.width !== this.rulerWidth) {
        this.rulerWidth = viewport.width;
        this.changeDetect.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
