import { Plugin, UniverInstanceType } from '@univerjs/core';
import { Injector } from '@wendellhu/redi';
import { CellHoverController } from './cell-hover.controller';

export class DragDropPlugin extends Plugin {
  static override pluginName = 'draggable-plugin';
  static override type = UniverInstanceType.UNIVER_SHEET;
  readonly _injector!: Injector;

  constructor() {
    super();
  }

  /** Plugin onStarting lifecycle */
  override onStarting(injector: Injector) {
    console.log('starting...');
    injector.add([CellHoverController]);
  }
}
