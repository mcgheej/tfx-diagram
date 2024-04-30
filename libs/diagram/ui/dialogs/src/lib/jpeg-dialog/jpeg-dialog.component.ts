import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Shape, nextInChain } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { Page, Size, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';

export interface JpegDialogData {
  dpi: number;
  quality: number;
  page: Page;
  shapes: Map<string, Shape>;
}

export interface JpegDialogResult {
  dpi: number;
  quality: number;
  data?: string;
}

@Component({
  selector: 'tfx-jpeg-dialog',
  templateUrl: './jpeg-dialog.component.html',
  styleUrls: ['./jpeg-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpegDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { read: ElementRef }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('thumbnail', { read: ElementRef }) thumbnail!: ElementRef<HTMLCanvasElement>;
  form!: UntypedFormGroup;

  imageWidth = 300;
  imageHeight = 300;

  thumbnailWidth = 250;
  thumbnailHeight = 250;

  quality = 0.8;

  constructor(
    private dialogRef: MatDialogRef<JpegDialogComponent, JpegDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: JpegDialogData
  ) {}

  ngOnInit(): void {
    this.quality = this.data.quality;
    const { width: w, height: h } = this.data.page.size;
    this.imageWidth = (w / 25.4) * this.data.dpi;
    this.imageHeight = (h / 25.4) * this.data.dpi;
    if (w <= h) {
      this.thumbnailWidth = (250 * w) / h;
      this.thumbnailHeight = 250;
    } else {
      this.thumbnailWidth = 250;
      this.thumbnailHeight = (250 * h) / w;
    }
  }

  ngAfterViewInit(): void {
    const c = (this.thumbnail.nativeElement as HTMLCanvasElement).getContext('2d', {
      willReadFrequently: true,
    });
    const { page, shapes } = this.data;
    if (c && page) {
      const t: Transform = {
        scaleFactor: this.thumbnailWidth / this.data.page.size.width,
        transX: 0,
        transY: 0,
      };
      this.drawPage(page.size, t, c);
      this.drawShapes(page.firstShapeId, shapes, page.size, c, t);
    }
  }

  async export() {
    const c = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d', {
      willReadFrequently: true,
    });
    const { page, shapes } = this.data;
    if (c && page) {
      const t: Transform = {
        scaleFactor: this.data.dpi / 25.4,
        transX: 0,
        transY: 0,
      };
      this.drawPage(page.size, t, c);
      this.drawShapes(page.firstShapeId, shapes, page.size, c, t);
    }

    const url = this.canvas.nativeElement.toDataURL('image/jpeg', this.quality);
    const base64Data = url.replace(/^data:image\/png;base64,/, '');
    this.dialogRef.close({ dpi: this.data.dpi, quality: this.quality, data: base64Data });
  }

  close() {
    this.dialogRef.close({ dpi: this.data.dpi, quality: this.data.quality });
  }

  // TODO: This is copy of code in page canvas so at some point these can be
  // refactored
  private drawPage(pageSize: Size, t: Transform, c: CanvasRenderingContext2D): void {
    c.save();
    c.fillStyle = 'white';
    c.fillRect(
      t.scaleFactor * t.transX,
      t.scaleFactor * t.transY,
      t.scaleFactor * pageSize.width,
      t.scaleFactor * pageSize.height
    );
    c.restore();
  }

  // TODO: This is copy of code in diagram canvas so at some point these can be
  // refactored
  private drawShapes(
    firstShapeId: string,
    shapes: Map<string, Shape>,
    pageSize: Size,
    c: CanvasRenderingContext2D,
    t: Transform
  ): void {
    c.save();
    this.clipToPage(pageSize, c, t);
    let shape = nextInChain(firstShapeId, shapes);
    while (shape) {
      shape.draw(c, t);
      shape = nextInChain(shape.nextShapeId, shapes);
    }
    c.restore();
  }

  // TODO: This is copy of code in diagram canvas so at some point these can be
  // refactored
  private clipToPage(pageSize: Size, c: CanvasRenderingContext2D, t: Transform) {
    c.beginPath();
    c.rect(
      t.scaleFactor * t.transX,
      t.scaleFactor * t.transY,
      t.scaleFactor * pageSize.width,
      t.scaleFactor * pageSize.height
    );
    c.clip();
  }
}
