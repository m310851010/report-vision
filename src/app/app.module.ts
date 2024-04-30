import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaseConfService } from '@commons';
import { environment } from '../environments/environment';
import { NzxModalModule } from '@xmagic/nzx-antd/modal';
import { NzxHttpInterceptorModule } from '@xmagic/nzx-antd/http-interceptor';
import { NzxAntdService } from '@xmagic/nzx-antd';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzxAntdConfigService } from './nzx-antd-config.service';
import { ReactiveFormsModule } from '@angular/forms';

registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NzxHttpInterceptorModule,
    NzxModalModule,
    NzMessageModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: BaseConfService, useValue: environment },
    NzxAntdConfigService,
    { provide: NzxAntdService, useExisting: NzxAntdConfigService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
