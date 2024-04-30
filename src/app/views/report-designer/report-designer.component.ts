import { Component, OnInit } from '@angular/core';

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
}
