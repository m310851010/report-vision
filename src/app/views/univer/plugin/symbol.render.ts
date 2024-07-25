import { IRange, IScale } from '@univerjs/core';
import { Range } from '@univerjs/core';
import { SpreadsheetSkeleton, UniverRenderingContext } from '@univerjs/engine-render';
import { SheetExtension } from '@univerjs/engine-render';
import { ConditionalFormattingIcon } from '@univerjs/sheets-conditional-formatting';
import { IVisionCellData } from '../univer-api';

export const SymbolUKey = 'report.sheet-symbol';

export class SymbolRender extends SheetExtension {
  override uKey = SymbolUKey;

  override Z_INDEX = 35;

  constructor(private iconRender: ConditionalFormattingIcon) {
    super();
  }

  // @ts-ignore
  override draw(
    ctx: UniverRenderingContext,
    parentScale: IScale,
    spreadsheetSkeleton: SpreadsheetSkeleton,
    diffRanges?: IRange[]
  ) {
    const { rowHeightAccumulation, columnWidthAccumulation, worksheet, dataMergeCache } = spreadsheetSkeleton;
    if (!worksheet) {
      return false;
    }

    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    Range.foreach(spreadsheetSkeleton.rowColumnSegment, (row, col) => {
      const cellData = worksheet.getCell(row, col) as IVisionCellData;
      const { extensionDirection } = cellData?.custom?.cellConfig || {};
      if (!extensionDirection) {
        return;
      }

      if (!worksheet.getColVisible(col) || !worksheet.getRowRawVisible(row)) {
        return;
      }

      const cellInfo = this.getCellIndex(row, col, rowHeightAccumulation, columnWidthAccumulation, dataMergeCache);
      let { isMerged, isMergedMainCell, mergeInfo, startY, endY, startX, endX } = cellInfo;
      if (isMerged) {
        return;
      }

      if (isMergedMainCell) {
        startY = mergeInfo.startY;
        startX = mergeInfo.startX;
        endX = mergeInfo.endX;
      }
      if (!this.isRenderDiffRangesByCell(mergeInfo, diffRanges)) {
        return;
      }
      ctx.font = '14px 宋体';
      ctx.fillStyle = 'red';
      if (extensionDirection === 'v') {
        ctx.fillText('↓', startX, startY + 15);
      } else {
        ctx.fillText('→', startX + 5, startY + 10);
      }
    });
    ctx.restore();
  }
}
