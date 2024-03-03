import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Playground } from '../../../playground/domain/classes/playground';
import { PlaygroundGridGenerator } from '../../../playground/domain/generators/playground-grid-generator';
import { FieldRenderService } from '../../../playground/domain/renderer/field-render.service.ts';
import { PlaygroundRenderService } from '../../../playground/domain/renderer/playground-render.service';
import { PointRendererService } from '../../../primitives/renderer/point-renderer.service';
import { ResourceGenerator } from '../../../resources/classes/generators/resource-generator';
import { ResourceFieldRendererService } from '../../../resources/classes/renderer/resource-field.renderer.service';
import { Viewport } from '../../../viewport/classes/viewport';
import { Game } from '../../classes/game';
import { PlaygroundGraphGenerator } from '../../../playground/domain/generators/playground-graph-generator';
import { PlaygroundGraphRenderer } from '../../../playground/domain/renderer/playground-graph-renderer';
import { Graph } from '../../../graph/domain/classes/graph';
import { Inventory } from '../../../inventory/domain/classes/inventory';
import { Player } from '../../../player/domain/classes/player';
import { RoadBuildManager } from '../../../buildings/domain/classes/road-build-manager';
import { BuildingBuildManager } from '../../../buildings/domain/classes/building-build-manager';
import { GraphBuildingNode } from '../../../buildings/domain/graph/graph-building-node';
import { TownRendererService } from '../../../buildings/domain/renderer/town-renderer.service';
import { PolygonRendererService } from '../../../primitives/renderer/polygon-renderer.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent implements AfterViewInit{
  @ViewChild('canvas', {
    static: true,
  })
  canvas: ElementRef<HTMLCanvasElement> | undefined ;

  @ViewChild('canvasWrapper', {
    static: true,
  })
  canvasWrapper: ElementRef<HTMLDivElement> | undefined ;
  private game !: Game;
  private viewport !: Viewport;


  public ngAfterViewInit(): void {
    const canvas = this.canvas?.nativeElement;
    const canvasWrapper = this.canvasWrapper?.nativeElement;
    if(!canvas || !canvasWrapper) return;
    this.determineCanvasSize(canvasWrapper, canvas);
    console.log(canvas);
    this.viewport = new Viewport(canvas);
    const ctx = canvas.getContext('2d')!;
    const buildingGraph = new Graph<GraphBuildingNode>();
    const playground = new Playground(
      new PlaygroundGridGenerator(),
      new PlaygroundRenderService(
        new ResourceFieldRendererService(ctx),
        new FieldRenderService(ctx)
      ),
      new ResourceGenerator(),
      new PlaygroundGraphGenerator(),
      new PointRendererService(ctx),
      new PlaygroundGraphRenderer(ctx, 
        new TownRendererService(
          new PolygonRendererService(ctx),
          this.viewport
        )
      ),
      buildingGraph
    );
    const player = new Player(
      {
        id: '543',
        name: 'Andreas.'
      },
      '#DAF7A6',
      new Inventory(),
      new Graph()
    );

    this.game = new Game(
      playground,
      player,      
      new RoadBuildManager(
        buildingGraph,
        player
      ),
      new BuildingBuildManager(
        buildingGraph,
        player
      )
    );
    this.game.generate();
    this.animate();
    console.log(this.canvas);
  }

  public animate() {
    this.viewport.reset();
    this.game.render();
    requestAnimationFrame(this.animate.bind(this));
  }

  public regen() {
    this.game.generate();
  }

  public save() {
    this.game.save();
  }

  public restore() {
    this.game.load();
  }


  private determineCanvasSize(canvasWrapper: HTMLDivElement, canvas: HTMLCanvasElement): void {
    canvas.width = canvasWrapper.clientWidth - 50;
    canvas.height = canvasWrapper.clientHeight - 50;
  }

  public test(event: MouseEvent) {
    if(event.button === 0) {
      const rect = this.canvas?.nativeElement.getBoundingClientRect()
      if(!rect) return;

      console.log("fuck yea", event)

      this.game.checknearbyField(
        this.viewport.getMouse(event)
      )
    }
  }

  @HostListener('mousedown', ['$event'])
  public mouseDown(event: MouseEvent) {
    if(event.button === 1){
      // middle mouse
      this.viewport.handleMiddleMouseDown(event);
    }
  }

  @HostListener('mouseup', ['$event'])
  public mouseUp(event: MouseEvent) {
    this.viewport.handleMouseUp(event);
  }

  @HostListener('mousemove', ['$event'])
  public mouseMove(event: MouseEvent) {
    this.viewport.handleMouseMove(event);
  }

  @HostListener("contextmenu", ["$event"])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  @HostListener("mousewheel", ["$event"])
  onmouseWheel(event: WheelEvent) {
    this.viewport.handleMouseWheel(event);
  }
}
