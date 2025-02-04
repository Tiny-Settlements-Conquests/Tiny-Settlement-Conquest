import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { dispatch } from '@ngneat/effects';
import { DEV_TOKEN } from '../../../../utils/tokens/dev.token';
import { CityRendererService } from '../../../buildings/domain/renderer/city-renderer.service';
import { TownRendererService } from '../../../buildings/domain/renderer/town-renderer.service';
import { GraphNode } from '../../../graph/domain/classes/graph-node';
import { Playground } from '../../../playground/domain/classes/playground';
import { FieldRenderService } from '../../../playground/domain/renderer/field-render.service.ts';
import { PlaygroundGraphRenderer } from '../../../playground/domain/renderer/playground-graph-renderer';
import { PlaygroundRenderService } from '../../../playground/domain/renderer/playground-render.service';
import { PolygonRendererService } from '../../../primitives/renderer/polygon-renderer.service';
import { ResourceFieldRendererService } from '../../../resources/domain/classes/renderer/resource-field.renderer.service';
import { Viewport } from '../../../viewport/classes/viewport';
import { GameModeRepository } from '../../domain/state/game-mode.repository';
import { EventQueueActions } from '../../../event-queues/domain/state/event-queue/event-queue.actions';
import { BuildingType } from '../../../buildings/domain/models/building.model';

@Component({
    selector: 'app-canvas',
    imports: [
        CommonModule,
    ],
    templateUrl: './canvas.component.html',
    styleUrl: './canvas.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent implements AfterViewInit {
  private readonly _gameModeRepository = inject(GameModeRepository);
  private readonly _devMode = inject(DEV_TOKEN);
  private readonly _gameMode = toSignal(
    this._gameModeRepository.selectMode()
  )

  @ViewChild('canvas', {
    static: true,
  })
  canvas: ElementRef<HTMLCanvasElement> | undefined ;

  @ViewChild('canvasWrapper', {
    static: true,
  })
  canvasWrapper: ElementRef<HTMLDivElement> | undefined ;


  public playground = input.required<Playground>()


  public viewport !: Viewport;
  private renderer !: PlaygroundRenderService;

  private lastClickedNode: GraphNode | null = null


  public ngAfterViewInit(): void {
    const canvas = this.canvas?.nativeElement;
    const canvasWrapper = this.canvasWrapper?.nativeElement;
    if(!canvas || !canvasWrapper) return;
    this.determineCanvasSize(canvasWrapper, canvas);
    this.viewport = new Viewport(canvas);
    const ctx = canvas.getContext('2d')!;
    const townRenderer = new TownRendererService(
      new PolygonRendererService(ctx),
      this.viewport
    );

    this.renderer = new PlaygroundRenderService(
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
    this.animate()
  }

  public animate() {
    const playground = this.playground();
    this.viewport.reset();
    this.renderer.render(playground);
    if(this._devMode) {
      this.renderer.renderDebugInformation(playground)
    }
    requestAnimationFrame(this.animate.bind(this));
  }

  private determineCanvasSize(canvasWrapper: HTMLDivElement, canvas: HTMLCanvasElement): void {
    canvas.width = canvasWrapper.clientWidth - 50;
    canvas.height = canvasWrapper.clientHeight - 50;
  }

  @HostListener('window:resize')
  onResize() {
    const canvas = this.canvas?.nativeElement;
    const canvasWrapper = this.canvasWrapper?.nativeElement;
    if (canvas && canvasWrapper) {
      this.determineCanvasSize(canvasWrapper, canvas);
    }
  }

  @HostListener('mousedown', ['$event'])
  public mouseDown(event: MouseEvent) {
    const gameMode = this._gameMode();
    const playground = this.playground();
      // middle mouse or left mouse
    if(event.button !== 0 && event.button !== 1) return;
    this.viewport.handleMiddleMouseDown(event);

    if(gameMode === 'spectate') return;
    const rect = this.canvas?.nativeElement.getBoundingClientRect()
    if(!rect) return;
    const point = this.viewport.getMouse(event);
    const nearbyGraphNode = playground.getNearestGraphNode(point);
    if(!nearbyGraphNode) {
      this.lastClickedNode = null;
      return;
    }
    if(gameMode === 'road') {
      let lastClickedNode = this.lastClickedNode
      const sourceNode = nearbyGraphNode;
      if(sourceNode && lastClickedNode){
        dispatch(EventQueueActions.publish({
          eventType: 'buildRoad',
          data: {
            from: sourceNode,
            to: lastClickedNode
          }
        }))
        this.lastClickedNode = null;
      } else {
        //todo das ist nicht gut, später über das gateway abbilden!
        this.lastClickedNode = sourceNode;
      }
    } else {
      //todo das ist nicht gut, später über das gateway abbilden!
      dispatch(EventQueueActions.publish({
        eventType: 'buildBuilding',
        data: {
          node: nearbyGraphNode,
          type: gameMode == 'city' ? BuildingType.CITY : BuildingType.TOWN
        },
      }))
    }

  }

  // auslagern in ne directive
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
