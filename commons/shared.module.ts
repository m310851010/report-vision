import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzxServiceModule } from '@xmagic/nzx-antd/service';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { NzxHttpInterceptorModule } from '@xmagic/nzx-antd/http-interceptor';
import { HttpClientModule } from '@angular/common/http';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgZorroAntdModule,
  HttpClientModule,
  NzxDirectiveModule,
  NzxTableModule,
  NzxPipeModule,
  NzxServiceModule,
  NzxHttpInterceptorModule
];

const COMPONENT: Type<any>[] = [];

@NgModule({
  declarations: [COMPONENT],
  imports: [MODULES],
  exports: [MODULES, COMPONENT],
  providers: []
})
export class SharedModule {}
