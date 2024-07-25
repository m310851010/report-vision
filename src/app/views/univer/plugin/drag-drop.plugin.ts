import {
  ColorKit,
  ICellData,
  ICommandService,
  IPosition,
  IRange,
  Plugin,
  ThemeService,
  UniverInstanceType
} from '@univerjs/core';
import { Injector } from '@wendellhu/redi';
import { getPrimaryForRange, SelectionManagerService, SetSelectionsOperation } from '@univerjs/sheets';
import { IHoverCellPosition } from '@univerjs/sheets-ui/lib/types/services/hover-manager.service';
import { dragUtil } from '../drag-util';
import { DeviceInputEventType } from '@univerjs/engine-render';
import { HoverManagerService, SetCellEditVisibleOperation } from '@univerjs/sheets-ui';
import { univerApi } from '../univer-api';
import { Subject, takeUntil } from 'rxjs';
import { createCellValue, Dataset } from '../../report-designer/report.service';

export class DragDropPlugin extends Plugin {
  static override pluginName = 'report.draggable-plugin';
  static override type = UniverInstanceType.UNIVER_SHEET;
  _injector!: Injector;

  override onStarting(injector: Injector) {
    this._injector = injector;
  }

  override onRendered() {
    const hoverManagerService = this._injector.get(HoverManagerService);
    const destroy$ = new Subject<void>();
    const hidePlaceholder = () => {
      cellPosition = null;
      if (div) {
        div.style.display = 'none';
      }
    };

    let dragEnd = true;
    let dragEnter = false;
    let cellPosition: IHoverCellPosition | null = null;
    dragUtil.dragStart.pipe(takeUntil(destroy$)).subscribe(async v => {
      dragEnd = false;
      cellPosition = null;
      const _commandService = this._injector.get(ICommandService);
      await _commandService.executeCommand(SetCellEditVisibleOperation.id, {
        visible: false,
        eventType: DeviceInputEventType.Keyboard
      });
      hoverManagerService.onScrollStart();
    });

    // 双击填充当前选中的单元格
    dragUtil.dblclick.pipe(takeUntil(destroy$)).subscribe(v => {
      const _selectionManagerService = this._injector.get(SelectionManagerService);
      const selection = _selectionManagerService.getFirst();
      if (!selection) return;
      this.setValues(selection.range, v.data).then();
    });

    dragUtil.mouseleave.pipe(takeUntil(destroy$)).subscribe(() => {
      hidePlaceholder();
      dragEnter = false;
      hoverManagerService.onScrollStart();
    });

    dragUtil.mouseenter.pipe(takeUntil(destroy$)).subscribe(() => {
      dragEnter = true;
    });

    dragUtil.dragEnd.pipe(takeUntil(destroy$)).subscribe(v => {
      dragEnd = true;
      if (cellPosition && dragEnter) {
        const { row, col } = cellPosition.location;
        this.setValues({ startRow: row, startColumn: col, endRow: row, endColumn: col }, v.data);
      }
      hidePlaceholder();
    });

    let div: HTMLElement;
    hoverManagerService.currentCell$.pipe(takeUntil(destroy$)).subscribe(v => {
      if (!v || dragEnd) {
        hidePlaceholder();
        return;
      }

      cellPosition = v;
      const poi = v.position;
      if (div) {
        div.style.display = 'block';
        Object.assign(div.style, {
          left: poi.startX + 'px',
          top: poi.startY + 'px',
          width: poi.endX - poi.startX + 1 + 'px',
          height: poi.endY - poi.startY + 1 + 'px'
        });
        return;
      }

      div = this.createPlaceholder(poi, this._injector);
      const currentRender = univerApi.renderManagerService.getRenderById(univerApi.getWorkbook().getUnitId())!;
      currentRender.engine.getCanvasElement().parentElement!.appendChild(div);
    });

    this.disposeWithMe({
      dispose() {
        destroy$.next();
        destroy$.complete();
      }
    });
  }

  private async setValues(range: IRange, data: Dataset) {
    const values: ICellData[][] = [];
    const { startRow, startColumn, endRow, endColumn } = range;

    for (let i = startRow; i <= endRow; i++) {
      const cells: ICellData[] = [];
      values.push(cells);
      for (let j = startColumn; j <= endColumn; j++) {
        cells.push({
          v: createCellValue(data),
          custom: { dataset: data, cellConfig: { extensionDirection: 'v' } }
        });
      }
    }

    await univerApi.setValues(range, values);
    await univerApi.commandService.executeCommand(SetSelectionsOperation.id, {
      selections: [{ range, primary: getPrimaryForRange(range, univerApi.getSheet()) }]
    });
  }

  private createPlaceholder(poi: IPosition, _injector: Injector) {
    const styleSheet = this._injector.get(ThemeService).getCurrentTheme();
    const div = document.createElement('div');
    Object.assign(div.style, {
      zIndex: 9999,
      position: 'absolute',
      left: poi.startX + 'px',
      top: poi.startY + 'px',
      width: poi.endX - poi.startX + 1 + 'px',
      height: poi.endY - poi.startY + 1 + 'px',
      backgroundColor: new ColorKit(styleSheet.primaryColor).setAlpha(0.2).toRgbString(),
      boxSizing: 'border-box',
      border: '1px solid ' + styleSheet.primaryColor,
      'pointer-events': 'none'
    });

    return div;
  }
}
