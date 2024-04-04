import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Viewport } from '../../../viewport/classes/viewport';
import { Game } from '../../domain/classes/game';
import { Playground } from '../../../playground/domain/classes/playground';
import { PlaygroundGridGenerator } from '../../../playground/domain/generators/playground-grid-generator';
import { ResourceGenerator } from '../../../resources/classes/generators/resource-generator';
import { Point } from '../../../primitives/classes/Point';
import { PreviewPlaygroundRenderService } from '../../../playground/domain/renderer/preview-playground-render.service';
import { PointRendererService } from '../../../primitives/renderer/point-renderer.service';
import { FieldRenderService } from '../../../playground/domain/renderer/field-render.service.ts';
import { ResourceFieldRendererService } from '../../../resources/classes/renderer/resource-field.renderer.service';
import { PlaygroundGraphGenerator } from '../../../playground/domain/generators/playground-graph-generator';
import { PlaygroundGraphRenderer } from '../../../playground/domain/renderer/playground-graph-renderer';
import { Player } from '../../../player/domain/classes/player';
import { Inventory } from '../../../inventory/domain/classes/inventory';
import { Graph } from '../../../graph/domain/classes/graph';
import { PlaygroundRenderService } from '../../../playground/domain/renderer/playground-render.service';
import { RoadBuildManager } from '../../../buildings/domain/classes/road-build-manager';
import { BuildingBuildManager } from '../../../buildings/domain/classes/building-build-manager';
import { GraphBuildingNode } from '../../../buildings/domain/graph/graph-building-node';
import { TownRendererService } from '../../../buildings/domain/renderer/town-renderer.service';
import { PolygonRendererService } from '../../../primitives/renderer/polygon-renderer.service';
import { CityRendererService } from '../../../buildings/domain/renderer/city-renderer.service';
import { PlaygroundGenerator } from '../../../playground/domain/generators/playground-generator';

@Component({
  selector: 'app-map-preview',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './map-preview.component.html',
  styleUrl: './map-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPreviewComponent implements AfterViewInit {
  private readonly hostEl = inject(ElementRef)

  @ViewChild('canvas', {
    static: true,
  })
  canvas: ElementRef<HTMLCanvasElement> | undefined ;
  
  private game !: Game;
  private viewport !: Viewport;

  public ngAfterViewInit(): void {
    const canvas = this.canvas?.nativeElement;
    const canvasWrapper = this.hostEl.nativeElement;
    if(!canvas || !canvasWrapper) return;
    this.determineCanvasSize(canvasWrapper, canvas);
    this.viewport = new Viewport(canvas);
    const ctx = canvas.getContext('2d')!;
    const playgroundGenerator = new PlaygroundGenerator(
      new PlaygroundGridGenerator(),
      new ResourceGenerator(),
      new PlaygroundGraphGenerator()
    );
    const townRenderer = new TownRendererService(
      new PolygonRendererService(ctx),
      this.viewport
    );
    const playground = playgroundGenerator.generate({
      fieldHeight: 9,
      fieldWidth: 9
    }, new Graph<GraphBuildingNode>())

    const playgroundRenderer = new PlaygroundRenderService(
      new ResourceFieldRendererService(ctx),
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
    this.centerViewPort(playground);
    this.viewport.reset();
    playgroundRenderer.render(playground);

    console.log(this.canvas);
  }

  public regen() {
  }

  public save() {
    // this.game.save();
  }

  public restore() {
    // this.game.load();
  }

  private centerViewPort(playground: Playground) {
    const { fieldHeight, fieldWidth } = playground.dimensions
    this.viewport.center = new Point(
      ( fieldWidth +1 * -90),
      ( fieldHeight +1 * -30)
    )
    this.viewport.zoom = 3;
  }


  private determineCanvasSize(canvasWrapper: HTMLDivElement, canvas: HTMLCanvasElement): void {
    console.log(canvasWrapper.clientHeight)
    canvas.width = canvasWrapper.clientWidth - 50;
    canvas.height = canvasWrapper.clientHeight - 50;
  }
}
