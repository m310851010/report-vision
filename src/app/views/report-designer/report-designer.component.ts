import { Component, OnInit } from '@angular/core';
import { DragData } from '../draggable/type';
import { dragUtil } from '../univer/drag-util';

@Component({
  selector: 'np-report-designer',
  templateUrl: './report-designer.component.html',
  host: { '[class.report-designer]': 'true' }
})
export class ReportDesignerComponent implements OnInit {
  isPreview = false;
  isEdit = false;
  name = '年度交易额统计';
  nameInput = this.name;
  fieldList = [
    {
      fieldName: 'ctotal',
      fieldText: 'ctotalctotalctotalctotalctotalctotalctotalctotalctotal'
    },
    {
      fieldName: 'cname',
      fieldText: 'cname'
    },
    {
      fieldName: 'cprice',
      fieldText: 'cprice'
    },
    {
      fieldName: 'riqi',
      fieldText: 'riqi'
    },
    {
      fieldName: 'id',
      fieldText: 'id'
    },
    {
      fieldName: 'dtotal',
      fieldText: 'dtotal'
    },
    {
      fieldName: 'tp',
      fieldText: 'tp'
    },
    {
      fieldName: 'ztotal',
      fieldText: 'ztotal'
    },
    {
      fieldName: 'cnum',
      fieldText: 'cnum'
    }
  ];
  selectedNode: any;
  panels = [
    {
      active: true,
      disabled: false,
      name: '数据集 1',
      fieldList: this.fieldList
    },
    {
      active: false,
      disabled: true,
      name: '数据集 2',
      fieldList: this.fieldList.map(v => ({ ...v }))
    },
    {
      active: false,
      disabled: true,
      name: '数据集 3',
      fieldList: this.fieldList.map(v => ({ ...v }))
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  onSetPreview(isPreview: boolean): void {
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
}
