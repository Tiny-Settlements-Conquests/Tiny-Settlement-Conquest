import { Point } from "../../../../primitives/classes/Point";
import { ResourceFieldRendererService } from "./resource-field.renderer.service";

export class ResourceFieldPreviewRenderer extends ResourceFieldRendererService{

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
    }

    override renderResourceImage(position: Point, image: HTMLImageElement) {
        const {x,y} = position;
        const ctx = this.ctx;
    
        ctx.moveTo(x,y)
      }
}