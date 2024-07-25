import {
  CommandType,
  IOperation,
  IRange,
  IUniverInstanceService,
  Nullable,
  UniverInstanceType,
  Workbook,
  Worksheet
} from '@univerjs/core';
import { createLeftCellStyle, IMarkParentCellService } from '../service/mark-parent-cell.service';
import { ISelectionWithStyle } from '@univerjs/sheets';
import { IVisionCellData, ParentCellType, ParentCellValue } from '../univer-api';

export interface IMarkParentCellOperationParams {
  unitId: string;
  subUnitId: string;
  pluginName: string;
  range: Nullable<IRange>;
}

export const MarkParentCellOperation: IOperation<IMarkParentCellOperationParams> = {
  id: 'report.operation.mark-parent-cell',
  type: CommandType.OPERATION,
  handler: (accessor, params) => {
    const _markSelectionService = accessor.get(IMarkParentCellService);
    if (!params) {
      return false;
    }

    _markSelectionService.removeAllShapes();
    if (!params.range) {
      return true;
    }

    const univerInstanceService = accessor.get(IUniverInstanceService);
    const workbook = univerInstanceService.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)!;
    const worksheet = workbook.getActiveSheet();

    const cellData = worksheet.getCellRaw(params.range.startRow, params.range.startColumn) as IVisionCellData;
    if (!cellData?.custom?.cellConfig) {
      return true;
    }

    const config = cellData.custom.cellConfig;

    if (config.leftCell === ParentCellType.CUSTOM && config.leftCellValue) {
      _markSelectionService.addShape(createSelection(worksheet, config.leftCellValue, '#13c2c2'));
    }

    if (config.topCell === ParentCellType.CUSTOM && config.topCellValue) {
      _markSelectionService.addShape(createSelection(worksheet, config.topCellValue, '#722ed1'));
    }

    _markSelectionService.refreshShapes();
    return true;
  }
};

function createSelection(worksheet: Worksheet, cellValue: ParentCellValue, color: string): ISelectionWithStyle {
  const { col, row } = cellValue;
  const range = worksheet.getMergedCell(row, col) ?? worksheet.getRange(row, col).getRangeData();
  return {
    range,
    primary: null,
    style: createLeftCellStyle(color)
  } as ISelectionWithStyle;
}
