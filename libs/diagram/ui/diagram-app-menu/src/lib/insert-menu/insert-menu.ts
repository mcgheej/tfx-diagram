import { Store } from '@ngrx/store';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import {
  AppMenuItem,
  MenuBuilderService,
  MenuItemGroup,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map } from 'rxjs';
import { InsertCircleCommand } from './commands/insert-circle.command';
import { InsertCurveCommand } from './commands/insert-curve.command';
import { InsertLineCommand } from './commands/insert-line.command';
import { InsertRectangleCommand } from './commands/insert-rectangle.command';
import { InsertTestCommand } from './commands/insert-test.command';
import { InsertTextCommand } from './commands/insert-text.command';
import { InsertTriangleCommand } from './commands/insert-triangle.command';

export class InsertMenu {
  private insertCircle = new InsertCircleCommand(this.mb, this.store);
  private insertRectangle = new InsertRectangleCommand(this.mb, this.store);
  private insertCurve = new InsertCurveCommand(this.mb, this.store);
  private insertLine = new InsertLineCommand(this.mb, this.store);
  private insertTriangle = new InsertTriangleCommand(this.mb, this.store);
  private insertText = new InsertTextCommand(this.mb, this.store);
  private insertTest = new InsertTestCommand(this.mb, this.store);

  private insertMenuItem: AppMenuItem = this.mb.appMenuItem({
    label: 'Insert',
    visible$: this.store.select(selectStatus).pipe(map((status) => status !== 'closed')),
    subMenu: this.mb.subMenu({
      id: 'insert-sub-menu',
      menuItemGroups: this.getMenuItemGroups(),
    }),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): AppMenuItem {
    return this.insertMenuItem;
  }

  cleanup() {
    this.insertCircle.cleanup();
    this.insertRectangle.cleanup();
    this.insertCurve.cleanup();
    this.insertLine.cleanup();
    this.insertTriangle.cleanup();
    this.insertText.cleanup();
    this.insertTest.cleanup();
  }

  private getMenuItemGroups(): MenuItemGroup[] {
    return [
      this.mb.menuItemGroup([
        this.insertCircle.getItem(),
        this.insertRectangle.getItem(),
        this.insertCurve.getItem(),
        this.insertLine.getItem(),
        this.insertTriangle.getItem(),
        this.insertText.getItem(),
        this.insertTest.getItem(),
      ]),
    ];
  }
}
