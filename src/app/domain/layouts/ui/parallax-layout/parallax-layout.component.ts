import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CloudSpawnerComponent } from '../../../menu/feature/cloud-spawner/cloud-spawner.component';
import { VERSION_TOKEN } from '../../../../utils/tokens/version.token';
import { ParallaxComponent } from '../../../menu/feature/parallax/parallax.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-parallax-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CloudSpawnerComponent,
    ParallaxComponent,
  ],
  templateUrl: './parallax-layout.component.html',
  styleUrl: './parallax-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParallaxLayoutComponent {
  public readonly versionToken = inject(VERSION_TOKEN);

  public mouseEvent = signal<MouseEvent | null>(null);

  @HostListener('mousemove', ['$event']) 
  public mouseMove(event: MouseEvent){
    this.mouseEvent.set(event);
  }

}
