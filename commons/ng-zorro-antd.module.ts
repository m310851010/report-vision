import { NgModule } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  exports: [
    NzInputModule,
    NzButtonModule,
    NzRadioModule,
    NzSelectModule,
    NzCheckboxModule,
    NzFormModule,
    NzGridModule,
    NzMessageModule,
    NzSpaceModule,
    NzDatePickerModule,
    NzIconModule
  ]
})
export class NgZorroAntdModule {}
