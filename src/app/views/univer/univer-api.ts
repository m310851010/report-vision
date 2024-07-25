import {
  CellValue,
  ICellData,
  ICommandService,
  IObjectMatrixPrimitiveType,
  IRange,
  isCellV,
  isFormulaString,
  isICellData,
  IUniverInstanceService,
  LifecycleStages,
  Nullable,
  ObjectMatrix,
  OnLifecycle,
  Range,
  Tools,
  Univer,
  UniverInstanceType,
  Workbook,
  Worksheet
} from '@univerjs/core';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { Inject, Injector } from '@wendellhu/redi';
import { IRenderManagerService } from '@univerjs/engine-render';
import {
  getSheetCommandTarget,
  ISelectionWithStyle,
  ISetSelectionsOperationParams,
  SelectionManagerService,
  SetRangeValuesCommand,
  SetSelectionsOperation
} from '@univerjs/sheets';
import { debounceTime, Observable, ReplaySubject } from 'rxjs';
import { Dataset } from '../report-designer/report.service';

export class UniverApi {
  static readonly unitId = 'workbook';
  static readonly sheetId = 'sheet';
  static readonly unitIdAndSubUnitId = {
    unitId: UniverApi.unitId,
    subUnitId: UniverApi.sheetId
  };
  univer!: Univer;

  readonly univerReady$ = new ReplaySubject<UniverApi>() as Observable<UniverApi>;
  private readonly _selection$ = new ReplaySubject<Readonly<ISelectionWithStyle[]>>();
  /**
   * 选区Change事件
   */
  readonly selections$ = this._selection$.pipe(debounceTime(100));

  constructor(
    @Inject(Injector) public readonly injector: Injector,
    @IUniverInstanceService public readonly univerInstanceService: IUniverInstanceService,
    @ICommandService public readonly commandService: ICommandService,
    @IRenderManagerService public readonly renderManagerService: IRenderManagerService
  ) {}

  static newApi(univer: Univer) {
    @OnLifecycle(LifecycleStages.Rendered, LifecycleInit)
    class LifecycleInit {
      constructor() {
        setTimeout(() => {
          (univerApi.univerReady$ as ReplaySubject<UniverApi>).next(univerApi);
          univerApi.commandService.onCommandExecuted((command, options) => {
            if (command.id === SetSelectionsOperation.id) {
              univerApi._selection$.next((command.params as ISetSelectionsOperationParams).selections);
            }
          });

          // 初始化获取选区
          univerApi._selection$.next(univerApi.getSelections());
        });
      }
    }

    const injector = univer.__getInjector();
    injector.add([LifecycleInit]);
    const instance = injector.createInstance(UniverApi);

    instance.univer = univer;
    Object.assign(univerApi, instance);
    return instance;
  }

  getWorkbook(): Workbook {
    return this.univerInstanceService.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)!;
  }

  getActiveSheet() {
    const workbook = this.getWorkbook();
    return workbook.getActiveSheet();
  }

  getSheet(): Worksheet {
    const workbook = this.getWorkbook();
    return workbook.getSheetBySheetId(UniverApi.sheetId)!;
  }

  getRange(range: IRange): Range;
  getRange(startRow: number, startColumn: number): Range;
  getRange(startRow: number, startColumn: number, endRow: number, endColumn: number): Range;
  getRange(startRow: any, startColumn?: any, endRow?: any, endColumn?: any): any {
    return this.getSheet().getRange(startRow, startColumn, endRow, endColumn);
  }

  getWorkbookSheet() {
    return getSheetCommandTarget(this.univerInstanceService, UniverApi.unitIdAndSubUnitId)!;
  }

  getSelections(): Readonly<ISelectionWithStyle[]> {
    return this.injector.get(SelectionManagerService).getSelections() ?? [];
  }

  setValues(
    range: IRange,
    value: CellValue[][] | IObjectMatrixPrimitiveType<CellValue> | ICellData[][] | IObjectMatrixPrimitiveType<ICellData>
  ): Promise<boolean> {
    const realValue = this.covertCellValues(value, range);
    return this.commandService.executeCommand(SetRangeValuesCommand.id, {
      ...UniverApi.unitIdAndSubUnitId,
      range,
      value: realValue
    });
  }

  mergeCell(ranges: IRange[]) {
    return this.commandService.executeCommand('sheet.command.add-worksheet-merge', {
      selections: ranges,
      ...UniverApi.unitIdAndSubUnitId
    });
  }

  private covertCellValues(
    value:
      | CellValue[][]
      | IObjectMatrixPrimitiveType<CellValue>
      | ICellData[][]
      | IObjectMatrixPrimitiveType<ICellData>,
    range: IRange
  ): IObjectMatrixPrimitiveType<ICellData> {
    const cellValue = new ObjectMatrix<ICellData>();
    if (Tools.isArray(value)) {
      const { startRow, startColumn } = range;
      Range.foreach(range, (r, c) =>
        cellValue.setValue(r, c, this.covertCellValue(value[r - startRow][c - startColumn]))
      );
    } else {
      const valueMatrix = new ObjectMatrix(value as IObjectMatrixPrimitiveType<ICellData | CellValue>);
      valueMatrix.forValue((r, c, v) => {
        cellValue.setValue(r, c, this.covertCellValue(v));
      });
    }

    return cellValue.getMatrix();
  }

  private covertCellValue(value: CellValue | ICellData): ICellData {
    if (isFormulaString(value)) {
      return {
        f: value as string
      };
    }
    if (isCellV(value)) {
      return {
        v: value as Nullable<CellValue>
      };
    }
    if (isICellData(value)) {
      return value;
    }

    // maybe {}
    return value as ICellData;
  }
}

// @ts-ignore
export const univerApi: UniverApi = new UniverApi();

export function createObjectMatrix(row: number, col: number, fill: ICellData): IObjectMatrixPrimitiveType<ICellData> {
  const value: IObjectMatrixPrimitiveType<ICellData> = {};
  for (let i = 0; i < row; i++) {
    value[i] = {};
    for (let j = 0; j < col; j++) {
      value[i][j] = NzxUtils.clone(fill);
    }
  }
  return value;
}

export class AbortCommandError extends Error {
  constructor() {
    super('Command blocked from execution');
    this.name = 'AbortCommandError';
  }
}

export interface IVisionCellData extends ICellData {
  custom: {
    dataset: Dataset;
    cellConfig: CellConfig;
  };
}

export interface CellConfig {
  /**
   * 扩展方向, v: 纵向，h：横向
   */
  extensionDirection: null | 'v' | 'h';
  spreadV: boolean;
  spreadH: boolean;
  /**
   * 0：无，1：默认 2:自定义
   */
  leftCell: ParentCellType;
  leftCellValue: ParentCellValue;
  topCell: ParentCellType;
  topCellValue: ParentCellValue;
  sortType?: SortType;
}

export enum ParentCellType {
  NONE = '0',
  NORMAL = '1',
  CUSTOM = 'custom'
}

export enum SortType {
  ASC = 'asc',
  DESC = 'desc',
  CUSTOM = 'custom'
}

export interface ParentCellValue {
  col: number;
  row: number;
}
