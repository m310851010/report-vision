import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportDesignerRoutingModule } from './report-designer-routing.module';
import { ReportDesignerComponent } from './report-designer.component';
import { SharedModule } from '@commons';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { UniverModule } from '../univer/univer.module';

@NgModule({
  declarations: [ReportDesignerComponent],
  imports: [
    CommonModule,
    ReportDesignerRoutingModule,
    SharedModule,
    NzTabsModule,
    NzCardModule,
    NzDropDownModule,
    UniverModule
  ]
})
export class ReportDesignerModule {}