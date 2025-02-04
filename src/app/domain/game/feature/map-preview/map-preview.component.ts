import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject, input } from '@angular/core';
import { GraphBuildingNode } from '../../../buildings/domain/graph/graph-building-node';
import { CityRendererService } from '../../../buildings/domain/renderer/city-renderer.service';
import { TownRendererService } from '../../../buildings/domain/renderer/town-renderer.service';
import { Graph } from '../../../graph/domain/classes/graph';
import { MapPlaygroundInformation } from '../../../map-selection/domain/models/map-selection.model';
import { Playground } from '../../../playground/domain/classes/playground';
import { PlaygroundGraphGenerator } from '../../../playground/domain/generators/playground-graph-generator';
import { FieldRenderService } from '../../../playground/domain/renderer/field-render.service.ts';
import { PlaygroundGraphRenderer } from '../../../playground/domain/renderer/playground-graph-renderer';
import { PlaygroundRenderService } from '../../../playground/domain/renderer/playground-render.service';
import { Point } from '../../../primitives/classes/Point';
import { PolygonRendererService } from '../../../primitives/renderer/polygon-renderer.service';
import { ResourceFieldPreviewRenderer } from '../../../resources/domain/classes/renderer/resource-field-preview.renderer.service';
import { Viewport } from '../../../viewport/classes/viewport';

@Component({
    selector: 'app-map-preview',
    imports: [
        CommonModule,
    ],
    templateUrl: './map-preview.component.html',
    styleUrl: './map-preview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapPreviewComponent implements AfterViewInit {
  private readonly hostEl = inject(ElementRef)

  @ViewChild('canvas', {
    static: true,
  })
  canvas: ElementRef<HTMLCanvasElement> | undefined ;
  private playground: Playground | undefined;
  
  private viewport !: Viewport;
  private renderer !: PlaygroundRenderService;


  public mapPlaygroundInformation = input.required<MapPlaygroundInformation>();

  public readonly _playground = effect(() => {
    const {dimensions, fields, resourceFields} = this.mapPlaygroundInformation();
    const graphGenerator = new PlaygroundGraphGenerator()

    const playground = new Playground({
      dimensions,
      gridGraph: graphGenerator.generateGraph(
        fields
      ),
      buildingGraph: new Graph<GraphBuildingNode>(),
      grid: fields,
      resources: resourceFields
    });
    this.playground = playground;
  })


  public ngAfterViewInit(): void {
    const canvas = this.canvas?.nativeElement;
    const canvasWrapper = this.hostEl.nativeElement;
    if(!canvas || !canvasWrapper || !this.playground) return;
    this.determineCanvasSize(canvasWrapper, canvas);
    this.viewport = new Viewport(canvas);

    const ctx = canvas.getContext('2d')!;

    const townRenderer = new TownRendererService(
      new PolygonRendererService(ctx),
      this.viewport
    );


    this.renderer = new PlaygroundRenderService(
      new ResourceFieldPreviewRenderer(ctx),
      new FieldRenderService(ctx),
      new PlaygroundGraphRenderer(
        ctx,
        townRenderer, 
        new CityRendererService(
          townRenderer, 
          this.viewport
        )
      )
    );
    this.centerViewPort(this.playground);
    this.render()
  }

  public render() {
    const playground = this.playground;
    if(!playground) return;
    this.viewport.reset();
    this.renderer.render(playground);
  }

  private centerViewPort(playground: Playground) {
    const { playgroundWidth, playgroundHeight } = playground.dimensions;
    this.viewport.center = new Point(
      ( playgroundWidth +1 * -90),
      ( playgroundHeight +1 * -30)
    )
    this.viewport.zoom = 3;
  }


  private determineCanvasSize(canvasWrapper: HTMLDivElement, canvas: HTMLCanvasElement): void {
    canvas.width = canvasWrapper.clientWidth - 50;
    canvas.height = canvasWrapper.clientHeight - 50;
  }
}
