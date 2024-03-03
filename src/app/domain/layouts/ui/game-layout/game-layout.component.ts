import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-game-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './game-layout.component.html',
  styleUrl: './game-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameLayoutComponent { }
