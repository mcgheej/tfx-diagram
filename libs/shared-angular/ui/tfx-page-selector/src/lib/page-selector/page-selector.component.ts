import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TfxIconButtonModule } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { PageTabsOverflowButtonComponent } from '../components/page-tabs-overflow-button.ts/page-tabs-overflow-button.component';
import { MoveResult, PageRenameDetails } from '../page-selector.types';

@Component({
  selector: 'tfx-page-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    TfxIconButtonModule,
    PageTabsOverflowButtonComponent,
  ],
  templateUrl: './page-selector.component.html',
  styleUrl: './page-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSelectorComponent {
  // inputs
  pages = input.required<string[]>();
  selectedPageIndex = input.required<number>();

  // outputs
  selectedPageIndexChange = output<number>();
  pageAddClick = output<void>();
  pageDeleteClick = output<number>();
  pageNameChange = output<PageRenameDetails>();
  pageOrderChange = output<MoveResult>();

  onPageListClick() {
    console.log('Page List click!');
  }

  onPageAddClick() {
    console.log('Page Add click!');
  }
}
