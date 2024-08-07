import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportDesignerRoutingModule } from './report-designer-routing.module';
import { ReportDesignerComponent } from './report-designer.component';
import { SharedModule } from '@commons';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { UniverModule } from '../univer/univer.module';
import { DraggableDirective } from './draggable.directive';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CellPropertyComponent } from './cell-property/cell-property.component';
import { NzxCheckboxModule } from '@xmagic/nzx-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@NgModule({
  declarations: [ReportDesignerComponent, DraggableDirective, CellPropertyComponent],
  imports: [
    CommonModule,
    ReportDesignerRoutingModule,
    SharedModule,
    NzTabsModule,
    NzCardModule,
    NzDropDownModule,
    UniverModule,
    NzCollapseModule,
    NzxCheckboxModule,
    NzInputNumberModule
  ]
})
export class ReportDesignerModule {}
