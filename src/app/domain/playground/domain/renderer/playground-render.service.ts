import { ResourceFieldRendererService } from "../../../resources/classes/renderer/resource-field.renderer.service";
import { ResourceField } from "../../../resources/models/resource-field.model";
import { Field } from "../classes/field";
import { FieldRenderService } from "./field-render.service.ts";

export class PlaygroundRenderService {
  

  constructor(
    protected readonly resourceFieldRendererService: ResourceFieldRendererService,
    protected readonly fieldRendererService: FieldRenderService,
  ) { }

  public render(grid: Field[], resources: ResourceField[]) {
    grid.forEach((field) => {
      this.renderFieldOrResource(field, resources);
    });
  }
  
  protected renderFieldOrResource(field: Field, resources: ResourceField[]) {
    const resource = this.findResourceForResourceField(field, resources);
    if (resource) {
      this.renderResource(resource);
    } else {
      this.fieldRendererService.render(field);
    }
  }
  
  protected findResourceForResourceField(field: Field, resources: ResourceField[]): ResourceField | undefined {
    return resources.find((r) => r.field.rowIndex === field.rowIndex && r.field.colIndex === field.colIndex);
  }
  
  protected renderResource(resource: ResourceField) {
    this.fieldRendererService.render(resource.field,  {fillStyle: resource.color});
    this.resourceFieldRendererService.renderResourceImage(resource.field.centerPoint, resource.getImage());
    this.resourceFieldRendererService.renderResourceValue(resource.field.centerPoint, resource.value);
  }

}
