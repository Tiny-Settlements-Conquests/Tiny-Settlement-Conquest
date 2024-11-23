import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'app-cloud-spawner',
  standalone: true,
  styleUrl: './cloud-spawner.component.scss',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloudSpawnerComponent {
  private readonly renderer = inject(Renderer2);
  private hostRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private activeCloudCount = 0;
  private readonly maxCloudCount = 12;
  private readonly minCloudSpeed = 80;
  private readonly maxCloudSpeed = 160;
  private lastCloudId = 1;
  private readonly cloudSpawnInterval = 5000;

  ngOnInit() {
    
    interval(this.cloudSpawnInterval).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      if(this.activeCloudCount >= this.maxCloudCount) return;
      this.spawnCloud();
      this.activeCloudCount++;
    })
  }

  private spawnCloud() {
    const container = this.hostRef.nativeElement;
    if(!container) return;
    const maxHeight = container.clientHeight;
    const randomHeight = Math.floor(Math.random() * maxHeight);
    const randomSpeed = Math.floor(this.minCloudSpeed + Math.random() * (this.maxCloudSpeed - this.minCloudSpeed));
    const cloudImage: HTMLImageElement = this.renderer.createElement('img');
    cloudImage.style.setProperty('--animation-duration', `${randomSpeed}s`);
    cloudImage.style.marginTop = `${randomHeight}px`;
    const randomAdditionalSize = 22 + Math.floor(Math.random() * 32);
    cloudImage.style.width = `${randomAdditionalSize * 4}px`;
    cloudImage.classList.add('cloud', 'absolute');
    const isSheep = Math.random() <= 0.05;
    if(isSheep) {
      cloudImage.src = `assets/menu/sky/sheep.png`; 
    } else {
      const randomCloud = this.generateRandomNumberInRangeExceptNumber(
        1,
        3,
        this.lastCloudId
      );
      this.lastCloudId = randomCloud;
      cloudImage.src = `assets/menu/sky/clouds${randomCloud}.png`; 
    }
    this.renderer.appendChild(container, cloudImage);
    ((ref: HTMLImageElement) => {
      setTimeout(() => {
        ref.remove();
        this.activeCloudCount--;
      },randomSpeed * 1000 )
    })(cloudImage)
  }

  private generateRandomNumberInRangeExceptNumber(min: number, max: number, except: number): number {
    let random = 0;
    do {
      random = Math.floor(Math.random() * max) + min;
    } while(random === except);
    return random;
  }
}
