import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditsComponent { }
