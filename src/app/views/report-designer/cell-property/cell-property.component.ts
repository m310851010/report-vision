import { Component, NgZone, OnInit } from '@angular/core';
import { CellConfig, IVisionCellData, ParentCellType, ParentCellValue, univerApi } from '../../univer/univer-api';
import { ISelectionWithStyle } from '@univerjs/sheets';
import { fieldList } from '../field-list';
import { ICellData, IObjectMatrixPrimitiveType, IRange, Nullable, Range } from '@univerjs/core';
import { createCellValue, Dataset } from '../report.service';
import { NzxCheckboxOption } from '@xmagic/nzx-antd/checkbox';
import { Spreadsheet } from '@univerjs/engine-render';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { takeUntil } from 'rxjs';
import { MarkParentCellOperation } from '../../univer/command/parent-cell.command';

@Component({
  selector: 'r-cell-property',
  templateUrl: './cell-property.component.html',
  host: {
    '[class.cell-property]': 'true'
  },
  providers: [NzDestroyService]
})
export class CellPropertyComponent implements OnInit {
  nzOptions = [
    { label: '无', value: ParentCellType.NONE },
    { label: '默认', value: ParentCellType.NORMAL },
    { label: '自定义', value: ParentCellType.CUSTOM }
  ];
  parentCellTypeCUSTOM = ParentCellType.CUSTOM;
  spreadVOptions = [{ label: '横向可延伸', value: true }];
  spreadHOptions = [{ label: '纵向可延伸', value: true }];
  dbOptions = [
    { label: 'prod', value: 'prod' },
    { label: 'dev', value: 'dev' },
    { label: 'test', value: 'test' }
  ];
  fieldNameOptions = fieldList.map(v => {
    return { label: v.fieldName, value: v.fieldName };
  });

  cellOptions: NzxCheckboxOption[] = [];
  rowOptions: NzxCheckboxOption[] = [];

  leftCell = '1';
  leftCellValue: ParentCellValue = { col: 0, row: 0 };
  topCell = '1';
  topCellValue: ParentCellValue = { col: 0, row: 0 };

  db?: string;
  fieldName?: string;
  extensionDirection: 'v' | 'h' | null = null;
  spreadV = [true];
  spreadH = [true];
  sortType: null | 'asc' | 'desc' | 'custom' = null;

  range!: IRange;
  cell!: IVisionCellData;
  constructor(private ngZone: NgZone, private destroy$: NzDestroyService) {}

  ngOnInit(): void {
    univerApi.selections$.pipe(takeUntil(this.destroy$)).subscribe(selections => {
      console.log(selections);
      this.ngZone.run(() => {
        this.fillCellOptions();
        this.onSelections(selections);
      });
    });
  }

  private getCell() {
    const sheet = univerApi.getSheet();
    return sheet.getCellRaw(this.range.startRow, this.range.startColumn)! as IVisionCellData;
  }

  private onSelections(selections: Readonly<ISelectionWithStyle[]>) {
    const sheet = univerApi.getSheet();
    const range = selections[0].range;
    this.range = range;
    const cell = sheet.getCellRaw(range.startRow, range.startColumn)! as IVisionCellData;
    this.cell = cell;

    const custom = cell?.custom;
    const dataset = custom?.dataset ?? ({} as Dataset);
    const cellConfig = custom?.cellConfig ?? {};
    this.spreadV = cellConfig.spreadV ?? true ? [true] : [];
    this.spreadH = cellConfig.spreadH ?? true ? [true] : [];
    this.extensionDirection = cellConfig.extensionDirection ?? null;
    this.sortType = cellConfig.sortType ?? null;
    this.db = dataset.db;
    this.fieldName = dataset.fieldName;
    this.leftCell = cellConfig.leftCell ?? '1';
    this.topCell = cellConfig.topCell ?? '1';
    this.leftCellValue = cellConfig.leftCellValue ?? { col: 0, row: 0 };
    this.topCellValue = cellConfig.topCellValue ?? { col: 0, row: 0 };
  }

  private fillCellOptions() {
    const sheet = univerApi.getSheet();
    const maxCell = sheet.getColumnCount();
    const cellOptions: NzxCheckboxOption[] = [];
    for (let i = 0; i < maxCell; i++) {
      cellOptions.push({ label: String.fromCharCode(i + 65), value: i });
    }
    this.cellOptions = cellOptions;

    const maxRow = sheet.getRowCount();
    const rowOptions: NzxCheckboxOption[] = [];
    for (let i = 0; i < maxRow; i++) {
      rowOptions.push({ label: `${i + 1}`, value: i });
    }
    this.rowOptions = rowOptions;
  }

  onDatasetChange() {
    this.setDataset('db', this.db!);
  }

  onFieldNameChange() {
    this.setDataset('fieldName', this.fieldName!);
  }

  setLeftParentCell(value: ParentCellType) {
    this.setCellConfig('leftCell', value, false);
    // const cell = this.getCell();
    const cell = this.cell;
    if (value === ParentCellType.CUSTOM && !cell.custom.cellConfig.leftCellValue) {
      cell.custom.cellConfig.leftCellValue = this.leftCellValue;
    }
    univerApi.commandService.executeCommand(MarkParentCellOperation.id, { range: this.range });
  }

  setTopParentCell(value: ParentCellType) {
    this.setCellConfig('topCell', value, false);
    // const cell = this.getCell();
    const cell = this.cell;
    if (value === ParentCellType.CUSTOM && !cell.custom.cellConfig.topCellValue) {
      cell.custom.cellConfig.topCellValue = this.topCellValue;
    }
    univerApi.commandService.executeCommand(MarkParentCellOperation.id, { range: this.range });
  }

  topCellValueChange() {
    this.cell.custom.cellConfig.topCellValue = this.topCellValue;
    univerApi.commandService.executeCommand(MarkParentCellOperation.id, { range: this.range });
  }

  leftCellValueChange() {
    this.cell.custom.cellConfig.leftCellValue = this.leftCellValue;
    univerApi.commandService.executeCommand(MarkParentCellOperation.id, { range: this.range });
  }

  setCellConfig<T extends keyof CellConfig>(prop: T, value: CellConfig[T], updateUI = false) {
    this.getCellData((cell, dataset) => {
      cell.custom ||= {};
      cell.custom.cellConfig ||= {};
      cell.custom!.cellConfig[prop] = value;
      return cell;
    });

    if (updateUI) {
      // 手动渲染
      const currentRender = univerApi.renderManagerService.getRenderById(univerApi.getWorkbook().getUnitId())!;
      (currentRender.mainComponent as Spreadsheet).makeForceDirty();
    }
  }

  setDataset<T extends keyof Dataset>(prop: T, value: Dataset[T]) {
    let hasDataset = false;
    const values = this.getCellData((cell, dataset) => {
      if (!cell.custom?.dataset) {
        return null;
      }
      hasDataset = true;
      cell.custom!.dataset[prop] = value;
      cell.v = createCellValue(dataset);
      return cell;
    });

    if (hasDataset) {
      values.forEach(v => univerApi.setValues(v.range, v.cellData));
    }
  }

  private getCellData(fn: (cell: ICellData, dataset: Dataset) => Nullable<ICellData>) {
    const sheet = univerApi.getSheet();
    return univerApi.getSelections().map(selection => {
      const range = selection.range;
      const cellData: IObjectMatrixPrimitiveType<ICellData> = {};
      Range.foreach(range, (r, c) => {
        const raw = sheet.getCellRaw(r, c)!;
        const dataset = raw.custom?.dataset;

        if (!cellData[r]) cellData[r] = {};
        const cell = fn(raw, dataset);
        if (cell) {
          cellData[r][c] = cell;
        }
      });
      return { range, cellData };
    });
  }
}
