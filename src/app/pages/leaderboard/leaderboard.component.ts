import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThreeDBoxComponent } from '../../domain/leaderboard/ui/3d-box/3d-box.component';

@Component({
  selector: 'app-leaderboard',
  imports: [
    ThreeDBoxComponent
  ],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardComponent { }
