import { Component, OnInit } from '@angular/core';
import { DragData } from '../draggable/type';
import { dragUtil } from '../univer/drag-util';
import { UniverApi, univerApi } from '../univer/univer-api';
import { fieldList } from './field-list';
import { Rect, Spreadsheet, SpreadsheetColumnHeader, SpreadsheetRowHeader } from '@univerjs/engine-render';
import { SHEET_VIEW_KEY } from '@univerjs/sheets-ui';

@Component({
  selector: 'r-report-designer',
  templateUrl: './report-designer.component.html',
  host: { '[class.report-designer]': 'true' }
})
export class ReportDesignerComponent implements OnInit {
  isPreview = false;
  isEdit = false;
  name = '年度交易额统计';
  nameInput = this.name;

  selectedNode: any;
  panels = [
    {
      active: true,
      disabled: false,
      name: '数据集 1',
      fieldList: fieldList
    },
    {
      active: false,
      disabled: true,
      name: '数据集 2',
      fieldList: fieldList.map(v => ({ ...v, db: 'prod' }))
    },
    {
      active: false,
      disabled: true,
      name: '数据集 3',
      fieldList: fieldList.map(v => ({ ...v, db: 'dev' }))
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  onSetPreview(isPreview: boolean): void {
    const s = univerApi.getSheet().getCell(0, 0);
    console.log(s);
    // console.log(univerApi.getWorkbook().save().sheets[UniverApi.sheetId]);
    univerApi.mergeCell([{ endColumn: 2, endRow: 2, startColumn: 0, startRow: 0 }]);
    // console.log(JSON.stringify(univerApi.getWorkbook().getSnapshot()));
    //
    // const spreadsheet = new Spreadsheet(SHEET_VIEW_KEY.MAIN);
    // const spreadsheetRowHeader = new SpreadsheetRowHeader(SHEET_VIEW_KEY.ROW);
    // const spreadsheetColumnHeader = new SpreadsheetColumnHeader(SHEET_VIEW_KEY.COLUMN);
    // const SpreadsheetLeftTopPlaceholder = new Rect(SHEET_VIEW_KEY.LEFT_TOP, {
    //   zIndex: 2,
    //   left: -1,
    //   top: -1,
    //   fill: 'rgb(248, 249, 250)',
    //   stroke: 'rgb(217, 217, 217)',
    //   strokeWidth: 1
    // });
    //
    // const scene = univerApi.renderManagerService.getCurrent()!.scene;
    // scene.addObjects([spreadsheet, spreadsheetRowHeader, spreadsheetColumnHeader, SpreadsheetLeftTopPlaceholder]);

    if (this.isPreview === isPreview) {
      return;
    }
    this.isPreview = isPreview;
  }

  onEditClick(nameRef: HTMLDivElement) {
    this.isEdit = true;

    setTimeout(() => nameRef.focus());
  }

  onOkClick() {
    this.isEdit = false;
    this.name = this.nameInput;
  }
  onCancelClick() {
    this.isEdit = false;
    this.nameInput = this.name;
  }

  ondragstart(context: DragData, item: any): void {
    context.data = item;
    dragUtil.dragStart.next(context);
  }

  ondragEnd(context: DragData, item: any): void {
    dragUtil.dragEnd.next(context);
  }

  onDblclick(item: any): void {
    dragUtil.dblclick.next({ data: item } as DragData);
  }
  onMouseleave(): void {
    dragUtil.mouseleave.next();
  }
  onMouseenter(): void {
    dragUtil.mouseenter.next();
  }
}
