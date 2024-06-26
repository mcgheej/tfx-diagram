import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ColorDialogComponentActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectCustomColorIds,
  selectCustomColors,
  selectStandardColors,
  selectThemeColors,
} from '@tfx-diagram/diagram/data-access/store/features/colors';
import { ColorRef, ColorTheme } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Observable, map, withLatestFrom } from 'rxjs';
import { ColorDialogData } from './color-dialog.types';

@Component({
  templateUrl: './color-dialog.component.html',
  styleUrls: ['./color-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorDialogComponent implements OnInit {
  highlightedColor: ColorRef | null = null;
  selectedColorRef!: ColorRef;
  dialogTitle = 'Colour Selection';

  store!: Store;
  themeColors$!: Observable<ColorTheme>;
  standardColors$!: Observable<Color[]>;
  customColors$!: Observable<Map<string, Color>>;

  constructor(
    private dialogRef: MatDialogRef<ColorDialogComponent, ColorRef>,
    @Inject(MAT_DIALOG_DATA) public data: ColorDialogData
  ) {}

  ngOnInit(): void {
    this.store = this.data.store;
    this.themeColors$ = this.store.select(selectThemeColors);
    this.standardColors$ = this.store.select(selectStandardColors);
    this.customColors$ = this.store.select(selectCustomColors).pipe(
      withLatestFrom(this.store.select(selectCustomColorIds)),
      map(([colors, ids]) => {
        const result = new Map<string, Color>();
        ids.map((id) => {
          if (colors[id]) {
            result.set(id, colors[id]);
          }
        });
        return result;
      })
    );

    if (this.data.dialogType === 'Fill Color') {
      this.dialogTitle = 'Fill Colour';
      this.selectedColorRef = this.data.selectedColors.fillColor as ColorRef;
    } else if (this.data.dialogType === 'Line Color') {
      this.dialogTitle = 'Line Colour';
      this.selectedColorRef = this.data.selectedColors.lineColor as ColorRef;
    } else {
      this.dialogTitle = 'Text Colour';
      this.selectedColorRef = this.data.selectedColors.textColor as ColorRef;
    }
  }

  onHighlightedColorChange(colorRef: ColorRef | null) {
    this.highlightedColor = colorRef;
  }

  onMouseEnter(colorRef: ColorRef) {
    this.highlightedColor = colorRef;
  }

  onMouseLeave() {
    this.highlightedColor = null;
  }

  onClick(colorRef: ColorRef) {
    this.dialogRef.close(colorRef);
  }

  onColorAdd(newColor: Color) {
    this.store.dispatch(ColorDialogComponentActions.customColorAdd({ newColor }));
  }
}
