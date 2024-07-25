import type { ISelectionStyle } from '@univerjs/sheets';
import { createIdentifier } from '@wendellhu/redi';

import { IMarkSelectionService } from '@univerjs/sheets-ui';

export interface IMarkParentCellService extends IMarkSelectionService {}

export const IMarkParentCellService = createIdentifier<IMarkParentCellService>('report.mark-parent-cell.service');

export function createLeftCellStyle(color: string): ISelectionStyle {
  return {
    strokeWidth: 1.5,
    stroke: color,
    fill: 'rgba(0, 0, 0, 0)',
    widgets: {},
    hasAutoFill: false,
    strokeDash: 8
  };
}
