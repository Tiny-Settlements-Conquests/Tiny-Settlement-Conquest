import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pause-overlay',
  imports: [],
  templateUrl: './pause-overlay.component.html',
  styleUrl: './pause-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PauseOverlayComponent { }
