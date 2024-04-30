import { NgModule } from '@angular/core';
import { NzxModalModule } from '@xmagic/nzx-antd/modal';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { NzxSwitchModule } from '@xmagic/nzx-antd/switch';
import { NzxServiceModule } from '@xmagic/nzx-antd/service';
import { NzxCheckboxModule } from '@xmagic/nzx-antd/checkbox';
import { NzxHttpInterceptorModule } from '@xmagic/nzx-antd/http-interceptor';

@NgModule({
  imports: [],
  exports: [
    NzxCheckboxModule,
    NzxModalModule,
    NzxDirectiveModule,
    NzxTableModule,
    NzxPipeModule,
    NzxSwitchModule,
    NzxServiceModule,
    NzxHttpInterceptorModule
  ],
  declarations: []
})
export class NzxAntdModule {}
