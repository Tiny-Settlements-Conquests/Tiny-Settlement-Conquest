import { ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, input, viewChild } from '@angular/core';
import { VERSION_TOKEN } from '../../../../utils/tokens/version.token';

@Component({
  selector: 'app-parallax',
  standalone: true,
  imports: [],
  templateUrl: './parallax.component.html',
  styleUrl: './parallax.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParallaxComponent { 
  private readonly forest = viewChild<ElementRef<HTMLImageElement>>('forest');
  private readonly mountains = viewChild<ElementRef<HTMLImageElement>>('mountains');
  private readonly grassland = viewChild<ElementRef<HTMLImageElement>>('grassland');
  public readonly versionToken = inject(VERSION_TOKEN)

  private hostRef = inject(ElementRef);
  private readonly defaultLeft = -8;
  private readonly defaultBottom = -3;
  private readonly mountainsParallax = 900;
  private readonly forestParallax = 400;
  private readonly grasslandParallax = 200;

  mouseEvent = input.required<MouseEvent | null>();

  public readonly _mouseMove = effect(() => {
    const $event = this.mouseEvent();
    if($event === null) return;
    const grassland = this.grassland();
    const forest = this.forest();
    const mountains = this.mountains()
    if(!grassland || !forest || !mountains) return;
    const grasslandRef = grassland.nativeElement;
    const forestRef = forest.nativeElement;
    const mountainsRef = mountains.nativeElement;
    const centerXOfHost = this.hostRef.nativeElement.clientWidth / 2;
    const centerYOfHost = this.hostRef.nativeElement.clientHeight / 2;

    const mousePosX = $event.clientX;
    const mousePosY = $event.clientY;

    const isLeftOfCenter = centerXOfHost > mousePosX;
    const isTopOfCenter = centerYOfHost > mousePosY;
    const mousePosDiff = isLeftOfCenter ? centerXOfHost - mousePosX : mousePosX - centerXOfHost;
    const mousePosDiffVertical = isTopOfCenter ? centerYOfHost - mousePosY : mousePosY - centerYOfHost;
    
    this.applyParallaxVertical(
      isTopOfCenter,
      mousePosDiffVertical / 300,
      this.defaultBottom,
      grasslandRef,
    )

    this.applyParallaxVertical(
      isTopOfCenter,
      mousePosDiffVertical / 900,
      this.defaultBottom + 14,
      forestRef,
    )
    
    this.applyParallaxHorizontal(
      isLeftOfCenter,
      mousePosDiff / this.grasslandParallax,
      this.defaultLeft,
      grasslandRef
    )
    this.applyParallaxHorizontal(
      isLeftOfCenter,
      mousePosDiff / this.forestParallax,
      this.defaultLeft,
      forestRef
    )
    this.applyParallaxHorizontal(
      isLeftOfCenter,
      mousePosDiff / this.mountainsParallax,
      this.defaultLeft,
      mountainsRef
    )
  })

  private applyParallaxHorizontal(
    isLeftOfCenter: boolean, 
    centerDifference: number, 
    offset: number,
    hostRef: HTMLImageElement
  ) {
    hostRef.style.left = isLeftOfCenter ? (offset + centerDifference) + '%' : offset - centerDifference + '%';
  }

  private applyParallaxVertical(
    isTopOfCenter: boolean, 
    centerDifference: number, 
    offset: number,
    hostRef: HTMLImageElement,
  ) {
    hostRef.style.bottom = !isTopOfCenter ? `${offset + centerDifference}%` : `${offset - centerDifference}%`;
  }
}
