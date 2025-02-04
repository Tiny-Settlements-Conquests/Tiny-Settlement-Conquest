import { ResourceFieldRendererService } from "../../../resources/domain/classes/renderer/resource-field.renderer.service";
import { ResourceField } from "../../../resources/domain/models/resource-field.model";
import { Field } from "../classes/field";
import { Playground } from "../classes/playground";
import { FieldRenderService } from "./field-render.service.ts";
import { PlaygroundGraphRenderer } from "./playground-graph-renderer";

export class PlaygroundRenderService {
  

  constructor(
    protected readonly resourceFieldRendererService: ResourceFieldRendererService,
    protected readonly fieldRendererService: FieldRenderService,
    protected readonly buildingGraphRenderer: PlaygroundGraphRenderer,
  ) { }

  public render(playground: Playground) {
    const resources = playground.resourceFields;
    const fields = playground.fields
    fields.forEach((field) => {
      this.renderFieldOrResource(field, resources);
    });

    this.buildingGraphRenderer.render(playground.buildingGraph);
  }

  public renderDebugInformation(playground: Playground) {
    this.buildingGraphRenderer.renderDebugInformation(playground.graph);
  }
  
  protected renderFieldOrResource(field: Field, resources: ResourceField[]) {
    const resource = this.findResourceForResourceField(field, resources);
    if (resource) {
      this.renderResource(resource);
    } else {
      // this.fieldRendererService.render(field, {fillStyle: 'transparent', strokeStyle: 'transparent'});
    }
  }
  
  protected findResourceForResourceField(field: Field, resources: ResourceField[]): ResourceField | undefined {
    return resources.find((r) => r.field.rowIndex === field.rowIndex && r.field.colIndex === field.colIndex);
  }
  
  protected renderResource(resource: ResourceField) {
    // this.fieldRendererService.render3DField(resource.field)
    this.fieldRendererService.render(resource.field,  {fillStyle: resource.color, backgroundImage: resource.resourceBackgroundImage});

    this.resourceFieldRendererService.renderResourceImage(resource.field.centerPoint, resource.resourceImage);
    this.resourceFieldRendererService.renderResourceValue(resource.field.centerPoint, resource.value);
  }
}
