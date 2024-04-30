import { Component, OnInit } from '@angular/core';
import { HttpLoadingService, LogoutService } from '@xmagic/nzx-antd/http-interceptor';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzxModalWrapService } from '@xmagic/nzx-antd/modal';
import { loadingService } from '@xmagic/nzx-antd/service';

@Component({
  selector: 'r-root',
  template: '<router-outlet></router-outlet>',
  styles: [':host{display: block; height: 100%}']
})
export class AppComponent implements OnInit {
  constructor(
    protected loading: HttpLoadingService,
    protected notifyService: LogoutService,
    protected modalService: NzxModalWrapService,
    protected message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loading.subscribe(status => loadingService.loading(status));

    this.notifyService.onLogout(error => {
      this.modalService.closeAll();
      if (error.timeout) {
        this.message.info(error.message || '登录超时，请重新登录');
      }
      window.top!.location.href = error?.url || '#/login';
    });
  }
}
