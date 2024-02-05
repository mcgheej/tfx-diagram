import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  HighlightColours,
  IconButtonConfig,
  IconButtonOptions,
} from '../icon-button.types';

const iconButtonDefaults: IconButtonOptions = {
  id: '',
  iconName: '',
  disabled: false,
  buttonType: 'circle',
  highlightDisabled: false,
  highlightBehaviour: 'lighten',
  rotation: '0deg',
  fontSizePx: 24,
  cursorType: 'pointer',
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'tfx-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent implements OnChanges {
  @Input() config!: IconButtonConfig;
  @Output() buttonClick = new EventEmitter<void>();

  highlightIcon = false;
  iconAreaStyles!: { [klass: string]: number | string };
  iconSymbolStyles!: { [klass: string]: number | string };

  ngOnChanges() {
    this.config = { ...iconButtonDefaults, ...this.config };
    this.iconAreaStyles = {
      gridArea: '1 / 1 / 1 / 1',
    };
    if (this.config.buttonType === 'circle') {
      this.iconAreaStyles['borderRadius.%'] = 50;
    } else {
      delete this.iconAreaStyles['borderRadius'];
    }
    this.iconSymbolStyles = {
      'fontSize.px': this.config.fontSizePx as number,
    };
    if (this.config.rotation !== '0deg') {
      this.iconSymbolStyles['transform'] = `rotate(${this.config.rotation})`;
    }
  }

  public onButtonClick() {
    if (!this.config.disabled) {
      this.buttonClick.emit();
    }
  }

  public onMouseEnter() {
    if (this.config.buttonType === 'icon') {
      if (!this.config.highlightDisabled) {
        this.highlightIcon = true;
      } else {
        this.highlightIcon = false;
      }
    } else if (!this.config.highlightDisabled && !this.config.disabled) {
      if (this.config.highlightBehaviour === 'lighten') {
        this.iconAreaStyles['boxShadow'] =
          'inset 0 0 100px 100px rgba(255, 255, 255, 0.1)';
      } else if (this.config.highlightBehaviour === 'darken') {
        this.iconAreaStyles['boxShadow'] =
          'inset 0 0 100px 100px rgba(0, 0, 0, 0.1)';
      } else if ((this.config.highlightBehaviour as HighlightColours).colour) {
        this.iconAreaStyles['color'] = (
          this.config.highlightBehaviour as HighlightColours
        ).colour;
        this.iconAreaStyles['backgroundColor'] = (
          this.config.highlightBehaviour as HighlightColours
        ).backgroundColour;
      }
    }
  }

  public onMouseLeave() {
    this.highlightIcon = false;
    delete this.iconAreaStyles['boxShadow'];
    delete this.iconAreaStyles['color'];
    delete this.iconAreaStyles['backgroundColor'];
  }
}
