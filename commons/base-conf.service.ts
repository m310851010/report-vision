import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class BaseConfService {
  basePath!: string;
}
