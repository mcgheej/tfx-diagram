import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ContextMenuService,
  FlexibleSubMenuPositioning,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Subscription } from 'rxjs';
import { ZoomContextMenuService } from '../zoom-context-menu.service';
import { ZoomControlService } from '../zoom-control.service';
import { ZoomSelectType } from '../zoom-control.types';
import { ZoomSharedDataService } from '../zoom-shared-data.service';

@Component({
  selector: 'tfx-zoom-control',
  templateUrl: './zoom-control.component.html',
  styleUrls: ['./zoom-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ZoomContextMenuService],
})
export class ZoomControlComponent implements OnInit, OnChanges, OnDestroy {
  @Input() zoomFactor: number = this.zoomService.getInitialZoom();
  @Output() zoomChange = new EventEmitter<ZoomSelectType>();

  @ViewChild('zoomText') zoomTextElRef!: ElementRef;

  private subscription: Subscription | null = null;

  constructor(
    private zoomService: ZoomControlService,
    private zoomContextMenu: ZoomContextMenuService,
    private sharedData: ZoomSharedDataService,
    private contextMenuService: ContextMenuService
  ) {}

  ngOnInit(): void {
    this.subscription = this.zoomContextMenu.menuResult$.subscribe((zoomSelected) => {
      this.zoomChange.emit(zoomSelected);
    });
  }

  ngOnChanges(): void {
    this.sharedData.zoomFactor = this.zoomFactor;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onContextMenu() {
    this.contextMenuService.openContextMenu(this.zoomContextMenu.getContextMenu(), {
      positioning: {
        type: 'Flexible',
        associatedElement: this.zoomTextElRef,
        positions: [
          {
            originX: 'center',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'bottom',
          },
        ],
      } as FlexibleSubMenuPositioning,
    });
  }

  public decreaseZoom() {
    this.zoomChange.emit(this.zoomService.getDecreasedZoom());
  }

  public increaseZoom() {
    this.zoomChange.emit(this.zoomService.getIncreasedZoom());
  }
}
