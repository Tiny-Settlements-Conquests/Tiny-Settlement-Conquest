import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostListener, OnInit, ViewChild, effect, inject } from '@angular/core';
import { Playground } from '../../../playground/domain/classes/playground';
import { PlaygroundGridGenerator } from '../../../playground/domain/generators/playground-grid-generator';
import { FieldRenderService } from '../../../playground/domain/renderer/field-render.service.ts';
import { PlaygroundRenderService } from '../../../playground/domain/renderer/playground-render.service';
import { PointRendererService } from '../../../primitives/renderer/point-renderer.service';
import { ResourceGenerator } from '../../../resources/classes/generators/resource-generator';
import { ResourceFieldRendererService } from '../../../resources/classes/renderer/resource-field.renderer.service';
import { Viewport } from '../../../viewport/classes/viewport';
import { Game } from '../../domain/classes/game';
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
import { CityRendererService } from '../../../buildings/domain/renderer/city-renderer.service';
import { PlaygroundGenerator } from '../../../playground/domain/generators/playground-generator';
import { Round } from '../../../round/domain/classes/round';
import { GameModeRepository } from '../../domain/state/game-mode.repository';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RoundPlayerRepository } from '../../../round/domain/state/round-players.repository';
import { RoundPlayer } from '../../../round/domain/models/round-player.model';
import { BuildCostManager } from '../../../buildings/domain/classes/build-cost-manager';

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
export class CanvasComponent implements AfterViewInit, OnInit {
  private readonly _gameModeRepository = inject(GameModeRepository);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _roundPlayerREpository = inject(RoundPlayerRepository);

  @ViewChild('canvas', {
    static: true,
  })
  canvas: ElementRef<HTMLCanvasElement> | undefined ;

  @ViewChild('canvasWrapper', {
    static: true,
  })
  canvasWrapper: ElementRef<HTMLDivElement> | undefined ;
  public game !: Game;
  private viewport !: Viewport;
  private renderer !: PlaygroundRenderService;

  public ngOnInit(): void {
    
  }



  public ngAfterViewInit(): void {
    const canvas = this.canvas?.nativeElement;
    const canvasWrapper = this.canvasWrapper?.nativeElement;
    if(!canvas || !canvasWrapper) return;
    this.determineCanvasSize(canvasWrapper, canvas);
    console.log(canvas);
    this.viewport = new Viewport(canvas);
    const ctx = canvas.getContext('2d')!;
    const buildingGraph = new Graph<GraphBuildingNode>();
    const townRenderer = new TownRendererService(
      new PolygonRendererService(ctx),
      this.viewport
    );
    const playgroundGenerator = new PlaygroundGenerator(
      new PlaygroundGridGenerator(),
      new ResourceGenerator(),
      new PlaygroundGraphGenerator()
    );

    const playground = playgroundGenerator.generate({
      fieldHeight: 9,
      fieldWidth: 9
    }, buildingGraph)

    const players: Player[] = this._roundPlayerREpository.getRoundPlayers().map((p, i) => {
      return new Player(
        p,
        new Inventory({
          wood: 10,
          bricks: 10,
          stone: 10,
          straw: 10,
          wool: 10
        }), 
        new Graph()
      )
    });

    const round = new Round(players);

    

    const buildCostManager = new BuildCostManager()

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

    this.game = new Game(
      playground,
      round,
      
      new RoadBuildManager(
        buildingGraph,
        buildCostManager,
      ),
      new BuildingBuildManager(
        buildingGraph,
        playground.graph,
        buildCostManager
      )
    );
    this._gameModeRepository.selectMode().pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe((mode) => {
      this.game.mode = mode;
    })

    this._roundPlayerREpository.selectActiveRoundPlayer().subscribe((roundPlayer) => {
      if(!roundPlayer) return;
      this._gameModeRepository.updateMode('spectate');
      console.log("update")
      round.setActivePlayerById(roundPlayer.id);
    })
    
    this.game.generate();
    this.animate();
    console.log(this.canvas);
  }

  public animate() {
    this.viewport.reset();
    this.renderer.render(this.game.playground);
    requestAnimationFrame(this.animate.bind(this));
  }

  private determineCanvasSize(canvasWrapper: HTMLDivElement, canvas: HTMLCanvasElement): void {
    canvas.width = canvasWrapper.clientWidth - 50;
    canvas.height = canvasWrapper.clientHeight - 50;
  }

  @HostListener('mousedown', ['$event'])
  public mouseDown(event: MouseEvent) {
    if(event.button === 0 || event.button === 1) {
      const rect = this.canvas?.nativeElement.getBoundingClientRect()
      if(!rect) return;
      this.game.checknearbyField(
        this.viewport.getMouse(event)
      )
      // middle mouse
      this.viewport.handleMiddleMouseDown(event);
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
