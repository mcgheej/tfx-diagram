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
  selector: 'tfx-left-ruler',
  templateUrl: './left-ruler.component.html',
  styleUrls: ['./left-ruler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftRulerComponent implements AfterViewInit, OnDestroy {
  readonly rulerWidth = 16;
  rulerHeight = 300;

  private subscription: Subscription | null = null;

  constructor(private changeDetect: ChangeDetectorRef, private store: Store) {}

  ngAfterViewInit(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.store.select(selectPageViewport).subscribe((viewport) => {
      if (viewport && viewport.height !== this.rulerHeight) {
        this.rulerHeight = viewport.height;
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
