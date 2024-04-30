import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportDesignerComponent } from './report-designer.component';

const routes: Routes = [{ path: '', component: ReportDesignerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportDesignerRoutingModule {}
