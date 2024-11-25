import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VERSION_TOKEN } from '../../../../utils/tokens/version.token';
import { CloudSpawnerComponent } from '../../../menu/feature/cloud-spawner/cloud-spawner.component';
import { ParallaxComponent } from '../../../menu/feature/parallax/parallax.component';
import { CreditsComponent } from '../../../credits/credits/credits.component';

@Component({
  selector: 'app-parallax-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CloudSpawnerComponent,
    ParallaxComponent,
    CreditsComponent
  ],
  templateUrl: './parallax-layout.component.html',
  styleUrl: './parallax-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParallaxLayoutComponent {
  public readonly versionToken = inject(VERSION_TOKEN);
  private readonly _location = inject(Location)

  public mouseEvent = signal<MouseEvent | null>(null);

  @HostListener('mousemove', ['$event']) 
  public mouseMove(event: MouseEvent){
    this.mouseEvent.set(event);
  }

  public isMainMenu = signal(false);

  ngOnInit() {
    this.isMainMenu.set(this._location.path().includes('menu'));
    this._location.onUrlChange((url) => {
      this.isMainMenu.set(url.includes('menu'));
    })
  }
}
