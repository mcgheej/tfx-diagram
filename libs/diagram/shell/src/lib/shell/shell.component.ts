import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
} from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ShellComponentActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { selectJpegQuality } from '@tfx-diagram/diagram-data-access-store-features-settings';
import {
  selectDialogOpen,
  selectExportStatus,
  selectModifiedTitle,
  selectStatus,
} from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { DiagramAppMenuService } from '@tfx-diagram/diagram/ui/diagram-app-menu';
import { JpegDialogComponent, JpegDialogResult } from '@tfx-diagram/diagram/ui/dialogs';
import { IconButtonConfig } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { Subject, combineLatest, map, takeUntil, withLatestFrom } from 'rxjs';
import { svgAlignBottomCenterLiteral } from './svg-icons/align-bottom-center_black_24dp';
import { svgAlignBottomLeftLiteral } from './svg-icons/align-bottom-left_black_24dp';
import { svgAlignBottomRightLiteral } from './svg-icons/align-bottom-right_black_24dp';
import { svgAlignCenterCenterLiteral } from './svg-icons/align-center-center_black_24dp';
import { svgAlignCenterLeftLiteral } from './svg-icons/align-center-left_black_24dp';
import { svgAlignCenterRightLiteral } from './svg-icons/align-center-right_black_24dp';
import { svgAlignTopCenterLiteral } from './svg-icons/align-top-center_black_24dp';
import { svgAlignTopLeftLiteral } from './svg-icons/align-top-left_black_24dp';
import { svgAlignTopRightLiteral } from './svg-icons/align-top-right_black_24dp';
import { svgBottomPaddingLiteral } from './svg-icons/bottom-padding_black_24dp';
import { svgLeftPaddingLiteral } from './svg-icons/left-padding_black_24dp';
import { svgRightPaddingLiteral } from './svg-icons/right-padding_black_24dp';
import { svgTopPaddingLiteral } from './svg-icons/top-padding_black_24dp';

// Do not want Mat Tooltip interactivity behaviour (doesn't hide tooltip when
// user moves mouse over tooltip). Set up own custom default and inject - as Shell
// at top of component tree everything below should inherit behaviour
export const myCustomTooltipDefaults: Partial<MatTooltipDefaultOptions> = {
  disableTooltipInteractivity: true,
};

@Component({
  selector: 'tfx-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults },
  ],
})
export class ShellComponent implements OnInit, OnDestroy {
  @Input() controlButtonConfigs: IconButtonConfig[] = [];
  @Output() controlButtonClick = new EventEmitter<number>();
  @Output() menuCmd = new EventEmitter<string>();

  appMenu = this.diagramAppMenu.getAppMenu();

  shellVM$ = combineLatest([
    this.store.select(selectModifiedTitle),
    this.store.select(selectStatus),
    this.store.select(selectDialogOpen),
  ]).pipe(
    map(([title, status, dialogOpen]) => {
      return {
        title,
        status,
        lowerZAppBar: dialogOpen,
      };
    })
  );

  private destroy$ = new Subject<void>();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private diagramAppMenu: DiagramAppMenuService,
    private store: Store,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.addSvgIconLiteral('svg_align_top_left', svgAlignTopLeftLiteral);
    this.addSvgIconLiteral('svg_align_top_center', svgAlignTopCenterLiteral);
    this.addSvgIconLiteral('svg_align_top_right', svgAlignTopRightLiteral);
    this.addSvgIconLiteral('svg_align_center_left', svgAlignCenterLeftLiteral);
    this.addSvgIconLiteral('svg_align_center_center', svgAlignCenterCenterLiteral);
    this.addSvgIconLiteral('svg_align_center_right', svgAlignCenterRightLiteral);
    this.addSvgIconLiteral('svg_align_bottom_left', svgAlignBottomLeftLiteral);
    this.addSvgIconLiteral('svg_align_bottom_center', svgAlignBottomCenterLiteral);
    this.addSvgIconLiteral('svg_align_bottom_right', svgAlignBottomRightLiteral);
    this.addSvgIconLiteral('svg_left_padding', svgLeftPaddingLiteral);
    this.addSvgIconLiteral('svg_right_padding', svgRightPaddingLiteral);
    this.addSvgIconLiteral('svg_top_padding', svgTopPaddingLiteral);
    this.addSvgIconLiteral('svg_bottom_padding', svgBottomPaddingLiteral);
    this.store.dispatch(ShellComponentActions.appStart());
    this.diagramAppMenu.cmds$.subscribe((cmd: string) => this.menuCmd.emit(cmd));
    this.manageExportJpeg();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onControlButtonClick(i: number) {
    this.controlButtonClick.emit(i);
  }

  private addSvgIconLiteral(name: string, svgLiteral: string) {
    this.matIconRegistry.addSvgIconLiteral(
      name,
      this.domSanitizer.bypassSecurityTrustHtml(svgLiteral)
    );
  }

  private manageExportJpeg() {
    this.store
      .select(selectExportStatus)
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(
          this.store.select(selectCurrentPage),
          this.store.select(selectShapes),
          this.store.select(selectJpegQuality)
        )
      )
      .subscribe(([exportStatus, page, shapes, quality]) => {
        if (exportStatus === 'requested' && page) {
          this.store.dispatch(ShellComponentActions.exportJpegClick());
          const dialogRef: MatDialogRef<JpegDialogComponent, JpegDialogResult> =
            this.dialog.open(JpegDialogComponent, {
              autoFocus: true,
              data: {
                dpi: 300,
                quality,
                page,
                shapes,
              },
            });
          dialogRef.afterClosed().subscribe((result) => {
            if (result && result.data) {
              this.store.dispatch(
                ShellComponentActions.exportJpegConfirmed({
                  data: result.data,
                  quality: result.quality,
                })
              );
            } else {
              if (result) {
                this.store.dispatch(
                  ShellComponentActions.exportJpegCancel({ quality: result.quality })
                );
              } else {
                this.store.dispatch(ShellComponentActions.exportJpegCancel({ quality }));
              }
            }
          });
        }
      });
  }
}
