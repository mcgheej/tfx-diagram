import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';

export const pagesFeatureKey = 'pages';

export interface PagesState {
  pages: { [id: string]: Page };
  pageIds: string[];
  currentPageId: string;
}
