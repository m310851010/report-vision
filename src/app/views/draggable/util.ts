import { DragData } from './type';

export function createDragDom(sourceDom: HTMLElement, dragData: DragData): HTMLElement {
  const dragDom = document.createElement('div');

  Object.assign(dragDom.style, {
    position: 'fixed',
    zIndex: '99999',
    cursor: 'copy',
    top: dragData.originY - 3 + 'px',
    left: dragData.originX - 3 + 'px'
  });

  dragDom.appendChild(sourceDom.cloneNode(true));
  document.getElementsByTagName('body')[0].appendChild(dragDom);

  return dragDom;
}

export class PubSubEvent {
  private eventMap: {
    [key: string]: Array<(...args: any[]) => Record<string, unknown> | boolean | void>;
  } = {};
  public on(eventName: string, callback: (...args: any[]) => Record<string, unknown> | boolean | void) {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = [];
    }
    this.eventMap[eventName].push(callback);
  }

  public emit(eventName: string, ...args: any[]) {
    if (this.eventMap[eventName]) {
      let result: Record<string, unknown> | boolean = {};
      this.eventMap[eventName].forEach(callback => {
        const r = callback(...args);
        if (typeof result === 'object' && typeof r === 'object' && r) {
          result = { ...result, ...r };
        }

        if (typeof r === 'boolean') {
          result = r;
        }
      });

      return result as Record<string, unknown> | boolean;
    }
    return undefined;
  }

  public off(eventName?: string) {
    if (eventName) {
      delete this.eventMap[eventName];
    } else {
      this.eventMap = {};
    }
  }
}
