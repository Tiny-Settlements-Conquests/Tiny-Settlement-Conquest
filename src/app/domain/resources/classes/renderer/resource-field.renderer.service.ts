import { Point } from "../../../primitives/classes/Point";

export class ResourceFieldRendererService {

  constructor(private readonly ctx: CanvasRenderingContext2D) { }

  renderResourceImage(position: Point, image: HTMLImageElement) {
    const {x,y} = position;
    const ctx = this.ctx;

    ctx.moveTo(x,y)
    ctx.drawImage(image, x - 30, y - 50, 60, 60);

  }

  renderResourceValue(position: Point, value: number) {
    const {x,y} = position;
    const ctx = this.ctx;

    const scale = 2.4;
    ctx.moveTo(x,y)
    ctx.save()
    ctx.scale(scale,scale);
    const length = (value + "").length;
    if(value > 6 && value < 10) {
        ctx.strokeStyle = 'red';
    }
    ctx.strokeText(value + "", (x - length * 7) / scale ,(y + 55) / scale) ;
    ctx.restore()
}

}
