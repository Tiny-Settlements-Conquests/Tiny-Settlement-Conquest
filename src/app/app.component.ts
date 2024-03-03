import { AfterContentInit, AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PlaygroundRenderService } from './domain/playground/domain/renderer/playground-render.service';
import { Game } from './domain/game/classes/game';
import { PlaygroundGridGenerator } from './domain/playground/domain/generators/playground-grid-generator';
import { Playground } from './domain/playground/domain/classes/playground';
import { ResourceGenerator } from './domain/resources/classes/generators/resource-generator';
import { CanvasComponent } from './domain/game/feature/canvas/canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CanvasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
