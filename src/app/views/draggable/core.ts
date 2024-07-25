import type { DragData, DraggableCoreOptions } from './type';
import { PubSubEvent } from './util';

export const DRAGGABLE_FLAG = 'report-draggable';
export const DRAGGABLE_CTX_FLAG = 'reportDraggableContext';

type DragEvent = 'beforeDrag' | 'dragStart' | 'dragging' | 'dragEnd' | 'click';
export type DragCallback = (context: DragData, e: MouseEvent) => Record<string, unknown> | void;

export class DragContext extends PubSubEvent {
  public state: DragData;

  readonly mouseDownHandler = this.onMouseDown.bind(this);
  private readonly mouseMoveHandler = this.onMouseMove.bind(this);
  private readonly mouseUpHandler = this.onMouseUp.bind(this);

  constructor(public dragHandler: HTMLElement, public options: DraggableCoreOptions) {
    super();

    this.state = {
      dragging: false,
      originX: 0,
      originY: 0,
      currentX: 0,
      currentY: 0,
      dragHandler,
      // 拖拽范围
      accRange: { x: [Infinity * -1, Infinity], y: [Infinity * -1, Infinity] }
    };
  }

  public override on(eventName: DragEvent, callback: DragCallback): void {
    super.on(eventName, callback);
  }

  public override emit(eventName: DragEvent, e: MouseEvent) {
    const result = super.emit(eventName, this.state, e);

    if (typeof result === 'boolean') {
      return result;
    }
    if (result) {
      delete result.dragging;
      delete result.originX;
      delete result.originY;
      delete result.currentX;
      delete result.currentY;
      delete result.accRange;

      this.state = {
        ...this.state,
        ...result
      };
    }

    return result;
  }

  public destroy(): void {
    this.off();
    this.dragHandler.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    window.removeEventListener('mouseup', this.mouseUpHandler);
    removeDraggableContext(this.dragHandler);
    this.dragHandler.removeAttribute(DRAGGABLE_FLAG);
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button) {
      return;
    }
    this.state.currentX = this.state.originX = e.clientX;
    this.state.currentY = this.state.originY = e.clientY;
    const result = this.emit('beforeDrag', e);
    if (typeof result !== 'boolean' || result) {
      document.getElementsByTagName('body')[0].style.userSelect = 'none';
      window.addEventListener('mousemove', this.mouseMoveHandler);
      window.addEventListener('mouseup', this.mouseUpHandler);
    }
  }

  private onMouseMove(e: MouseEvent) {
    const axis = this.options.axis || 'both';
    const debounce = this.options.debounce ?? 0;

    if (axis === 'none') {
      return;
    }
    const dragData = this.state;
    dragData.currentX = e.clientX;
    dragData.currentY = e.clientY;
    const xChange = Math.abs(dragData.currentX - dragData.originX);
    const yChange = Math.abs(dragData.currentY - dragData.originY);
    if (
      (axis === 'x' && xChange > 0) ||
      (axis === 'y' && yChange > 0) ||
      (axis === 'both' && (xChange > 0 || yChange > 0))
    ) {
      if (xChange > debounce || yChange > debounce) {
        if (!dragData.dragging) {
          dragData.dragging = true;
          this.emit('dragStart', e);
        }
        this.emit('dragging', e);
      }
    }
  }

  private onMouseUp(e: MouseEvent) {
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    window.removeEventListener('mouseup', this.mouseUpHandler);
    document.getElementsByTagName('body')[0].style.userSelect = 'auto';
    if (!this.state.dragging) {
      this.emit('click', e);
    } else {
      this.state.dragging = false;
      this.emit('dragEnd', e);
    }
  }
}

const DEFAULT_OPTIONS: DraggableCoreOptions = {
  axis: 'both',
  debounce: 0,
  useCapturing: true
};

export function getDraggableContext(dragHandler: HTMLElement): DragContext | undefined {
  // @ts-ignore
  return dragHandler[DRAGGABLE_CTX_FLAG];
}

function removeDraggableContext(dragHandler: HTMLElement): void {
  // @ts-ignore
  delete dragHandler[DRAGGABLE_CTX_FLAG];
}

export function makeDraggable(dragHandler: HTMLElement, _options?: DraggableCoreOptions): DragContext | undefined {
  const options = { ...DEFAULT_OPTIONS, ...(_options || {}) };
  const oldId = dragHandler.getAttribute(DRAGGABLE_FLAG);
  if (oldId) {
    return;
  }

  const context = new DragContext(dragHandler, options);
  const id = `${DRAGGABLE_FLAG}-${Date.now()}-${Math.random()}`.replace('.', '');

  context.dragHandler.setAttribute(DRAGGABLE_FLAG, id);

  context.dragHandler.addEventListener('mousedown', context.mouseDownHandler, !!options.useCapturing);
  // @ts-ignore
  dragHandler[DRAGGABLE_CTX_FLAG] = context;
  return context;
}
