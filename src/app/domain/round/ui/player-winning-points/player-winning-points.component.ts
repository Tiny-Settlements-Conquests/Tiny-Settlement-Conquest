import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CircleProgressComponent } from '../../../circle-progress/circle-progress/circle-progress.component';

@Component({
  imports: [
    CircleProgressComponent
  ],
  selector: 'app-player-winning-points',
  templateUrl: './player-winning-points.component.html',
  styleUrls: ['./player-winning-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PlayerWinningPointsComponent {
  public readonly totalSegments = input.required<number>(); // Gesamtanzahl der Segmente
  public readonly activeSegments = input.required<number>(); // Anzahl der farbigen Segmente
}