import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ShapeInspectorService } from './shape-inspector.service';

@Component({
  selector: 'tfx-shape-inspector',
  // templateUrl: './shape-inspector.component.html',
  // styleUrls: ['./shape-inspector.component.scss'],
  template: `
    <div *ngIf="visible" class="shape-inspector">
      <div *ngIf="vm$ | async as vm" class="container">
        <div class="title">Shape Inspector</div>
        <mat-tab-group>
          <mat-tab label="Draw Chain">
            <tfx-shapes-draw-chain
              [vm]="vm"
              (toggleExpansion)="onToggleExpandedInDrawChain($event)"
            ></tfx-shapes-draw-chain>
          </mat-tab>
          <mat-tab label="Groups">Show groups here</mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [
    `
      .shape-inspector {
        height: 100%;
        width: 325px;
        border-right: 1px solid #dfe3e8;
      }

      .container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto 1fr;
      }

      .title {
        margin: 3px 0 10px 3px;
        font-size: 12pt;
        font-weight: 500;
        color: #9f9fa1;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ShapeInspectorService],
})
export class ShapeInspectorComponent {
  @Input() visible = false;

  vm$ = this.service.vm$;

  constructor(private service: ShapeInspectorService) {}

  onToggleExpandedInDrawChain(id: string) {
    this.service.toggleExpandedInDrawChain(id);
  }
}
