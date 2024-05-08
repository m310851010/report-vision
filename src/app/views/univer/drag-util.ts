import { EventEmitter, Output } from '@angular/core';
import { DragData } from '../draggable/type';
import { Subject } from 'rxjs';

class DragUtil {
  dragStart = new Subject<DragData>();
  dragEnd = new Subject<DragData>();
  dblclick = new Subject<DragData>();
  mouseleave = new Subject<void>();
}

export const dragUtil = new DragUtil();
