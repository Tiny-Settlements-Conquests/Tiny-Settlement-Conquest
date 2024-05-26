import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { CityRendererService } from '../../../buildings/domain/renderer/city-renderer.service';
import { TownRendererService } from '../../../buildings/domain/renderer/town-renderer.service';
import { FieldRenderService } from '../../../playground/domain/renderer/field-render.service.ts';
import { PlaygroundGraphRenderer } from '../../../playground/domain/renderer/playground-graph-renderer';
import { PlaygroundRenderService } from '../../../playground/domain/renderer/playground-render.service';
import { PolygonRendererService } from '../../../primitives/renderer/polygon-renderer.service';
import { Viewport } from '../../../viewport/classes/viewport';
import { Game } from '../../domain/classes/game';
import { ResourceFieldRendererService } from '../../../resources/domain/classes/renderer/resource-field.renderer.service';

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
export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvas', {
    static: true,
  })
  canvas: ElementRef<HTMLCanvasElement> | undefined ;

  @ViewChild('canvasWrapper', {
    static: true,
  })
  canvasWrapper: ElementRef<HTMLDivElement> | undefined ;


  @Input({ 'required' : true })
  public game !: Game


  public viewport !: Viewport;
  private renderer !: PlaygroundRenderService;


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
    this.viewport.reset();
    this.renderer.render(this.game!.playground);
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
      const point = this.viewport.getMouse(event);
      const nearbyGraphNode = this.game.playground.getNearestGraphNode(point)
      if(nearbyGraphNode) {
        this.game!.tryBuildBuildingOnGraphNode(nearbyGraphNode)
      } else {
        this.game.roadBuildManager.resetSelectedGraphNode();
      }
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
