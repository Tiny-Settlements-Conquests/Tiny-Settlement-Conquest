import { Point } from "../../primitives/classes/Point";
import { add, scale, subtract } from "../../primitives/functions/util";

export class Viewport {
  private readonly ctx: CanvasRenderingContext2D;
  private maxZoom = 2;
  private minZoom = 0.3;
  public zoom = 1;
  
  public center = new Point(this.canvas.width / 2, this.canvas.height / 2);
  public offset = scale(this.center, -1);
  public maxOffset = 50;
  public minOffset = -1000;

  public drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active:false
  }

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public handleMouseWheel(event: WheelEvent) {
    this.updateZoom(Math.sign(event.deltaY));
  }

  public reset() {
      this.ctx.restore();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.translate(this.center.x, this.center.y);
      this.ctx.scale(1 / this.zoom, 1 / this.zoom);
      const offset = this.getOffset();
      this.ctx.translate(offset.x, offset.y);
  }

  public getViewPoint() {
    return scale(this.getOffset(), -1);
  }

  /**
   * calculates the corrected offset based on its drag level
   * @returns 
   */
  public getOffset() {
      const newOffset = add(this.offset, this.drag.offset);
      // if(newOffset.x > this.maxOffset) {
      //   newOffset.x = this.maxOffset;
      // } else if(newOffset.x < this.minOffset) {
      //   newOffset.x = this.minOffset;
      // }

      // if(newOffset.y > this.maxOffset) {
      //   newOffset.y = this.maxOffset;
      // } else if(newOffset.y < this.minOffset) {
      //   newOffset.y = this.minOffset;
      // }
      return newOffset;
  }

  /**
   * get the correct Mouse Position based on its zoom level
   * @param event 
   * @returns 
   */
  public getMouse(event: MouseEvent, subtractDragOffset = false) {
      //todo make an own function if we want to subtract instead of a boolish parameter
      const p = new Point(
          (event.offsetX - this.center.x) * this.zoom - this.offset.x,
          (event.offsetY - this.center.y) * this.zoom - this.offset.y
      );
      return subtractDragOffset ? subtract(p, this.drag.offset) : p;
  }

  private updateZoom(dir: number) {
      const step = 0.1;
      this.zoom += dir * step;
      // keep zoom between 1 and 5;
      this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom))
  }

  public handleMiddleMouseDown(event: MouseEvent) {
      this.drag.start = this.getMouse(event);
      this.drag.active = true;
  }

  public handleMouseMove(event: MouseEvent) {
      if(this.drag.active) {
          this.drag.end = this.getMouse(event);
          this.drag.offset = subtract(this.drag.end, this.drag.start)
      }
  }

  public handleMouseUp(event: MouseEvent) {
      if(this.drag.active) {
          this.offset = add(this.offset, this.drag.offset);
          this.drag = {
              start: new Point(0, 0),
              end: new Point(0, 0),
              offset: new Point(0, 0),
              active:false
          }
      }
  }
}
