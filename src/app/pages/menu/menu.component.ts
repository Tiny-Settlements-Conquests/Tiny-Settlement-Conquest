import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {

}
