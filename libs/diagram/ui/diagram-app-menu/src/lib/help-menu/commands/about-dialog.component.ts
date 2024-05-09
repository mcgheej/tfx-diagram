import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tfx-about-dialog',
  template: `
    <div class="container">
      <div class="content-container">
        <div class="dialog-title">About Diagram</div>
        <div></div>
        <div class="footer">Diagram v0.2.1 (09/05/2024)</div>
      </div>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      justify-content: center;
      color: rgba(0, 0, 0, 0.87);
    }

    .content-container {
      width: 300px;
      height: 400px;
      padding: 24px 32px;
      display: grid;
      grid-template-rows: auto 1fr auto;
    }

    .dialog-title {
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      margin: 0;
    }

    .footer {
      font-size: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutDialogComponent {}
