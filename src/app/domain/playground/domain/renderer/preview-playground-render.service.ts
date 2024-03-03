import { ResourceField } from "../../../resources/models/resource-field.model";
import { PlaygroundRenderService } from "./playground-render.service";

export class PreviewPlaygroundRenderService extends PlaygroundRenderService {
  
    protected override renderResource(resource: ResourceField): void {
      this.fieldRendererService.render(resource.field,  {fillStyle: resource.color});
      this.resourceFieldRendererService.renderResourceValue(resource.field.centerPoint, resource.value);
    }
 
}
