import { ICommandInfo, Plugin, UniverInstanceType } from '@univerjs/core';
import { Injector } from '@wendellhu/redi';
import { univerApi } from '../univer-api';
import { SetRangeValuesMutation, ISetRangeValuesMutationParams } from '@univerjs/sheets';

/**
 * 禁止绑定数据集的单元格编辑
 */
export class NotExecuteFormulaPlugin extends Plugin {
  static override pluginName = 'report.not-execute-formula.plugin';
  static override type = UniverInstanceType.UNIVER_SHEET;
  _injector!: Injector;

  override onStarting(injector: Injector) {
    this._injector = injector;
  }

  override onRendered() {
    univerApi.commandService.beforeCommandExecuted((cmd, options) => {
      const command = cmd as Readonly<ICommandInfo<ISetRangeValuesMutationParams>>;
      if (command.id === SetRangeValuesMutation.id && command.params && command.params.cellValue) {
        const range = command.params.cellValue;
        for (const rowId in range) {
          const row = range[rowId]!;
          for (const colId in row) {
            const col = row[colId]!;
            if (col.f) {
              col.v = col.f;
            }
          }
        }
      }
    });
  }
}
