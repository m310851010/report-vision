import { ICommandService, Plugin, UniverInstanceType } from '@univerjs/core';
import { Injector } from '@wendellhu/redi';
import { IRenderManagerService } from '@univerjs/engine-render';
import { IMarkParentCellService } from '../service/mark-parent-cell.service';
import type { Dependency } from '@wendellhu/redi';
import { MarkParentCellController } from '../controller/mark-parent-cell.controller';
import { MarkSelectionService } from '@univerjs/sheets-ui';
import { MarkParentCellOperation } from '../command/parent-cell.command';

/**
 * 父子格（左父格，上父格）插件
 */
export class ParentCellPlugin extends Plugin {
  static override pluginName = 'report.parent-cell.plugin';
  static override type = UniverInstanceType.UNIVER_SHEET;
  _injector!: Injector;

  override onStarting(injector: Injector) {
    this._injector = injector;
    ([[IMarkParentCellService, { useClass: MarkSelectionService }]] as Dependency[]).forEach(d => injector.add(d));

    const _commandService = this._injector.get(ICommandService)!;
    this.disposeWithMe(_commandService.registerCommand(MarkParentCellOperation));

    const _renderManagerService = this._injector.get(IRenderManagerService)!;
    this.disposeWithMe(
      _renderManagerService.registerRenderController(UniverInstanceType.UNIVER_SHEET, MarkParentCellController)
    );
  }
}
