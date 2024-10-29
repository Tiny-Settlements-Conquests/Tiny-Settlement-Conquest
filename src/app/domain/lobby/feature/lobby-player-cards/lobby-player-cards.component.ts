import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

type LobbyUser = {
  id: string | undefined,
  name: string,
  profileUrl: string,
};

@Component({
  selector: 'app-lobby-player-cards',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent
  ],
  templateUrl: './lobby-player-cards.component.html',
  styleUrl: './lobby-player-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyPlayerCardsComponent {
  public readonly players: LobbyUser[] = [{
    name: 'xScodayx',
    profileUrl: 'assets/robot_3.png',
    id: '2'
  }, {
    id: undefined,
    name: 'Andy',
    profileUrl: 'assets/robot.png',
  }, {
    id: undefined,
    name: 'Mika',
    profileUrl: 'assets/robot_2.png',
  }];

  public readonly icons = {
    crown: faCrown
  };

  public meId = '2';
}
