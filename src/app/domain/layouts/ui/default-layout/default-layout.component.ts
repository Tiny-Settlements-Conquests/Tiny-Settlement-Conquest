import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultLayoutComponent { }
