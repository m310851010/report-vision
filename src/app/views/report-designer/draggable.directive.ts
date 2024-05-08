import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { draggable } from '../draggable/draggable';
import { DragContext } from '../draggable/core';
import { DragData } from '../draggable/type';

@Directive({
  selector: '[r-draggable]'
})
export class DraggableDirective implements OnInit, OnDestroy {
  element: HTMLElement;
  dragContext!: DragContext;

  @Output() dragStart = new EventEmitter<DragData>();
  @Output() dragging = new EventEmitter<DragData>();
  @Output() dragEnd = new EventEmitter<DragData>();
  @Output() beforeDrag = new EventEmitter<DragData>();
  constructor(public elementRef: ElementRef) {
    this.element = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    const dragContext = (this.dragContext = draggable(this.element, {
      useSubstitute: true,
      substituteClass: 'dragging-placeholder'
    }));
    dragContext.on('dragStart', e => this.dragStart.emit(e));
    dragContext.on('dragging', e => this.dragging.emit(e));
    dragContext.on('dragEnd', e => this.dragEnd.emit(e));
    dragContext.on('beforeDrag', e => this.beforeDrag.emit(e));
  }

  ngOnDestroy(): void {
    this.dragContext.destroy();
  }
}
