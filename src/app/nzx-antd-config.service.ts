import { Injectable } from '@angular/core';
import { NzxAntdService } from '@xmagic/nzx-antd';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NzxAntdConfigService extends NzxAntdService {
  override basePath = environment.basePath;
  override response = { data: 'data' };
  constructor() {
    super();
  }
}
