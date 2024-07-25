import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MoveResult } from '@tfx-diagram/diagram/ui/page-selector';
import { PageRenameDetails } from '../page-selector.types';

@Component({
  selector: 'tfx-page-selector',
  standalone: true,
  imports: [CommonModule],
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
}
