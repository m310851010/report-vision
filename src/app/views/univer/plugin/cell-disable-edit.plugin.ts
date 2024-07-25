import { ICellData, Nullable, Plugin, Range, UniverInstanceType } from '@univerjs/core';
import { Injector } from '@wendellhu/redi';
import { AbortCommandError, univerApi } from '../univer-api';
import { SetCellEditVisibleOperation } from '@univerjs/sheets-ui';
import { ClearSelectionContentCommand, SelectionManagerService } from '@univerjs/sheets';
import { DeviceInputEventType } from '@univerjs/engine-render';
import { CutContentCommand, DeleteCommand, InnerPasteCommand, InsertCommand } from '@univerjs/docs';

/**
 * 禁止绑定数据集的单元格编辑
 */
export class CellDisableEditPlugin extends Plugin {
  static override pluginName = 'report.cell-disable-edit.plugin';
  static override type = UniverInstanceType.UNIVER_SHEET;
  _injector!: Injector;

  override onStarting(injector: Injector) {
    this._injector = injector;
  }

  override onRendered() {
    univerApi.commandService.beforeCommandExecuted((command, options) => {
      const params = command.params! as any;

      // 清空时 删除自定义数据
      if (command.id === ClearSelectionContentCommand.id) {
        const cells = this.getSelectionCells();
        cells.forEach(cell => {
          if (cell?.custom) {
            cell.custom = null;
          }
        });
        return;
      }

      if (
        (command.id === SetCellEditVisibleOperation.id && params.visible) ||
        command.id === InsertCommand.id || // 插入
        command.id === DeleteCommand.id || // 删除
        command.id === CutContentCommand.id || // 剪切
        command.id === InnerPasteCommand.id || // 粘贴
        command.id === 'zen-editor.operation.open-zen-editor' // 禅模式编辑
      ) {
        const cells = this.getSelectionCells();
        if (cells.every(cell => !cell?.custom?.dataset)) return;

        // 双击数据集字段
        if (params?.eventType === DeviceInputEventType.Dblclick) {
          // 自定义数据集
          console.log('自定义数据集', params, cells);
        }

        throw new AbortCommandError();
      }
    });
  }

  getSelectionCells(): Nullable<ICellData>[] {
    const selection = this._injector.get(SelectionManagerService).getFirst();
    if (!selection) {
      return [];
    }
    const sheet = univerApi.getSheet();
    const list: Nullable<ICellData>[] = [];
    Range.foreach(selection.range, (row, col) => list.push(sheet.getCellRaw(row, col)));
    return list;
  }
}
