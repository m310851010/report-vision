export interface DragData {
  dragging: boolean;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  dragHandler: HTMLElement;

  accRange: { x: [number, number]; y: [number, number] };

  data?: any;
  [key: string]: any;
}

export type DraggableCoreOptions = {
  /**
   * response to dragging on each axis
   */
  axis?: 'both' | 'x' | 'y' | 'none';

  /**
   * 在去抖值范围内不会触发拖动行为
   */
  debounce?: number;

  /**
   * 在 mousedown 事件侦听器上使用捕获
   */
  useCapturing?: boolean;
};
export type DraggableOptions =
  | (DraggableCoreOptions & {
      /**
       * 绑定拖动事件dragHandler的特定[dom / dom类名称]需要是draggable dom的子级
       */
      dragHandler?: string | HTMLElement;
      /**
       * 使用 dom 的边界矩形作为拖动的限制区域
       */
      dragZone?: HTMLElement;
      /**
       * 最后一次拖动结束后保存位置
       */
      holdPosition?: boolean;
    }) &
      (
        | {
            /**
             * 使用替代 dom 作为可拖动对象
             */
            useSubstitute?: false;
          }
        | {
            /**
             * 使用替代 dom 作为可拖动对象
             */
            useSubstitute: true;
            /**
             * 替代 dom class样式名
             */
            substituteClass?: string;
            /**
             * 替代 dom class样式名
             */
            createDragDom?: (sourceDom: HTMLElement, dragData: DragData) => HTMLElement;
          }
      );
