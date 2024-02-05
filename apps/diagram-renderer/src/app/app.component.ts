import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IconButtonConfig } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { Subject, takeUntil } from 'rxjs';
import { ControlButtonsService } from './control-buttons/control-buttons.service';

@Component({
  selector: 'tfx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Diagram';
  controlButtonConfigs: IconButtonConfig[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private changeRef: ChangeDetectorRef,
    private controlButtons: ControlButtonsService
  ) {}

  ngOnInit() {
    this.controlButtons.buttonConfigs$
      .pipe(takeUntil(this.destroy$))
      .subscribe((configs) => {
        this.controlButtonConfigs = configs;
        this.changeRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onControlButtonClick(i: number) {
    this.controlButtons.processButtonClick(i);
  }

  onMenuCmd(cmd: string) {
    if (cmd === 'file-exit') {
      this.controlButtons.processCloseButton();
    }
  }
}
