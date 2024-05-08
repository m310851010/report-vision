import type { IScale } from '@univerjs/core';
import type { SpreadsheetSkeleton, UniverRenderingContext } from '@univerjs/engine-render';
import {
  DEFAULT_FONTFACE_PLANE,
  FIX_ONE_PIXEL_BLUR_OFFSET,
  getColor,
  MIDDLE_CELL_POS_MAGIC_NUMBER,
  SheetExtension
} from '@univerjs/engine-render';

const UNIQUE_KEY = 'CellCustomExtension';

// Show custom emojis on row headers
const customEmojiList = ['🍎11', '🍌2', '🍒3', '🍓', '🍅', '🍆', '🍇', '🍈', '🍉', '🍊'];

export class MainCustomExtension extends SheetExtension {
  override uKey = UNIQUE_KEY;

  // Must be greater than 50
  override get zIndex() {
    return 50;
  }

  override draw(ctx: UniverRenderingContext, parentScale: IScale, spreadsheetSkeleton: SpreadsheetSkeleton) {
    const { rowColumnSegment } = spreadsheetSkeleton;
    const { startRow, endRow, startColumn, endColumn } = rowColumnSegment;
    if (!spreadsheetSkeleton) {
      return;
    }

    const { rowHeightAccumulation, columnTotalWidth, columnWidthAccumulation, rowTotalHeight } = spreadsheetSkeleton;

    if (
      !rowHeightAccumulation ||
      !columnWidthAccumulation ||
      columnTotalWidth === undefined ||
      rowTotalHeight === undefined
    ) {
      return;
    }

    ctx.fillStyle = getColor([248, 249, 250]);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = getColor([0, 0, 0])!;
    ctx.beginPath();
    ctx.lineWidth = 1;

    ctx.translateWithPrecisionRatio(FIX_ONE_PIXEL_BLUR_OFFSET, FIX_ONE_PIXEL_BLUR_OFFSET);

    ctx.strokeStyle = getColor([217, 217, 217]);
    ctx.font = `13px ${DEFAULT_FONTFACE_PLANE}`;
    let preRowPosition = 0;
    const rowHeightAccumulationLength = rowHeightAccumulation.length;
    for (let r = startRow - 1; r <= endRow; r++) {
      if (r < 0 || r > rowHeightAccumulationLength - 1) {
        continue;
      }
      const rowEndPosition = rowHeightAccumulation[r];
      if (preRowPosition === rowEndPosition) {
        // Skip hidden rows
        continue;
      }

      let preColumnPosition = 0;
      const columnWidthAccumulationLength = columnWidthAccumulation.length;
      for (let c = startColumn - 1; c <= endColumn; c++) {
        if (c < 0 || c > columnWidthAccumulationLength - 1) {
          continue;
        }

        const columnEndPosition = columnWidthAccumulation[c];
        if (preColumnPosition === columnEndPosition) {
          // Skip hidden columns
          continue;
        }

        // painting cell text
        const middleCellPosX = preColumnPosition;
        const middleCellPosY = preRowPosition;
        customEmojiList[c] &&
          ctx.fillText(customEmojiList[c], middleCellPosX + 1, middleCellPosY + MIDDLE_CELL_POS_MAGIC_NUMBER); // Magic number 1, because the vertical alignment appears to be off by 1 pixel
        preColumnPosition = columnEndPosition;
      }

      preRowPosition = rowEndPosition;
    }
    ctx.stroke();
  }
}
