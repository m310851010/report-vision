import {
  Disposable,
  IColorStyle,
  ICommandService,
  IRange,
  Range,
  IUniverInstanceService,
  LifecycleStages,
  OnLifecycle,
  UniverInstanceType,
  Workbook,
  Worksheet,
  ICellData,
  ObjectMatrix,
  IBorderData,
  CellValue
} from '@univerjs/core';
import { IRenderManagerService } from '@univerjs/engine-render';
import { Inject, Injector } from '@wendellhu/redi';
import { HoverManagerService } from '@univerjs/sheets-ui';
import {
  getSheetCommandTarget,
  ISetRangeValuesMutationParams,
  ISetStyleCommandParams,
  SelectionManagerService,
  SetBackgroundColorCommand,
  SetRangeValuesMutation,
  SetStyleCommand
} from '@univerjs/sheets';
import { dragUtil } from '../drag-util';
import { DragData } from '../../draggable/type';
import { IHoverCellPosition } from '@univerjs/sheets-ui/lib/types/services/hover-manager.service';
import { FormulaDataModel } from '@univerjs/engine-formula';
import { FRange } from '@univerjs/facade';
import { covertCellValue } from '@univerjs/facade/lib/types/apis/sheets/utils';

@OnLifecycle(LifecycleStages.Rendered, CellHoverController)
export class CellHoverController extends Disposable {
  constructor(
    @Inject(IRenderManagerService) private readonly renderManagerService: IRenderManagerService,
    @Inject(Injector) private readonly _injector: Injector,
    @Inject(SelectionManagerService) private readonly _selectionManagerService: SelectionManagerService,
    @ICommandService private readonly _commandService: ICommandService,
    @IRenderManagerService private _renderManagerService: IRenderManagerService,
    @Inject(HoverManagerService) private _hoverManagerService: HoverManagerService,
    @IUniverInstanceService private _univerInstanceService: IUniverInstanceService
  ) {
    super();

    this._initPointerEvent();
  }

  setValue(row: number, col: number, value: CellValue | ICellData) {
    const target = getSheetCommandTarget(this._univerInstanceService);
    if (!target) return;

    const { worksheet, workbook } = target;
    const range = worksheet.getRange(row, col);
    const fRange = new FRange(workbook, worksheet, range.getRangeData(), this._injector, this._commandService);
    return fRange.setValue(value);
  }

  private _initPointerEvent() {
    const instance = this._univerInstanceService.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)!;
    const currentRender = this._renderManagerService.getRenderById(instance.getUnitId());
    if (!currentRender) {
      return;
    }

    const target = getSheetCommandTarget(this._univerInstanceService);
    if (!target) return;

    const hidePlaceholder = () => {
      if (div) {
        div.style.display = 'none';
      }
    };

    let dragEnd = true;
    let cellPosition: IHoverCellPosition | null = null;
    dragUtil.dragStart.subscribe(v => {
      dragEnd = false;
      cellPosition = null;
      this._hoverManagerService.onScrollStart();
    });

    dragUtil.dblclick.subscribe(v => {
      const selection = this._selectionManagerService.getFirst()!;
      this.setValue(selection.range.startRow, selection.range.startColumn, v.data!.fieldText);
    });

    dragUtil.mouseleave.subscribe(() => {
      hidePlaceholder();
      this._hoverManagerService.onScrollStart();
    });

    dragUtil.dragEnd.subscribe(v => {
      dragEnd = true;
      hidePlaceholder();
      if (cellPosition) {
        this.setValue(cellPosition.location.row, cellPosition.location.col, v.data!.fieldText);
      }
    });

    let div: HTMLElement;
    const observer = this._hoverManagerService.currentCell$.subscribe(v => {
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

      div = document.createElement('div');
      Object.assign(div.style, {
        zIndex: 9999,
        position: 'absolute',
        left: poi.startX + 'px',
        top: poi.startY + 'px',
        width: poi.endX - poi.startX + 1 + 'px',
        height: poi.endY - poi.startY + 1 + 'px',
        backgroundColor: 'rgba(92, 169, 54, 0.3)',
        boxSizing: 'border-box',
        border: '1px solid #3f9f10',
        'pointer-events': 'none'
      });

      currentRender.engine.getCanvasElement().parentElement!.appendChild(div);
    });

    this.disposeWithMe({
      dispose() {
        observer.unsubscribe();
        // scene.onPointerMoveObserver.remove(observer);
      }
    });
  }
}
