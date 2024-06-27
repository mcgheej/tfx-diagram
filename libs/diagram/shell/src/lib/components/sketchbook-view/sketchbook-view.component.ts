import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MoveResult, PageRenameDetails } from '@tfx-diagram/diagram/ui/page-selector';
import { ZoomSelectType } from '@tfx-diagram/diagram/ui/zoom-control';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { SketchbookViewService } from './sketchbook-view.service';

@Component({
  selector: 'tfx-sketchbook-view',
  templateUrl: './sketchbook-view.component.html',
  styleUrls: ['./sketchbook-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SketchbookViewService],
})
export class SketchbookViewComponent {
  // Injected service
  private service = inject(SketchbookViewService);

  viewVM$ = this.service.viewVM$;

  onZoomChanged(zoomSelected: ZoomSelectType) {
    this.service.zoomChange(zoomSelected);
  }

  onPageAdd() {
    this.service.addPage();
  }

  onPageDelete(pageIndex: number, pages: Page[]) {
    this.service.deletePage(pageIndex, pages);
  }

  onPageRename(renameDetails: PageRenameDetails, pages: Page[]) {
    this.service.renamePage(renameDetails, pages);
  }

  onPageChange(newCurrentPageIndex: number) {
    this.service.changePage(newCurrentPageIndex);
  }

  onPageMove(move: MoveResult) {
    this.service.movePage(move);
  }
}
