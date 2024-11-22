import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultLayoutComponent { }
