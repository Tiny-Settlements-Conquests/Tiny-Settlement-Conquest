import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Input, signal } from '@angular/core';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { ActionCardComponent } from '../../../cards/feature/action-card/action-card.component';
import { RoundPlayer } from '../../domain/models/round-player.model';
import { PlayerWinningPointsComponent } from '../player-winning-points/player-winning-points.component';


//todo checken ob das überhaupt sinn ergibt, eig. nicht -> ist ja schon als round-player-card implementiert
@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [
    ActionCardComponent,
    NgStyle,
    PlayerWinningPointsComponent,
  ],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerCardComponent {
  public icons = {
    question: faQuestion
  }

  public readonly player = input.required<RoundPlayer>();

  public readonly winningPoints = input<number>(0);

  private readonly _isMe = signal<boolean>(false);
  
  @Input()
  public set isMe(v: boolean) {
    this._isMe.set(v);
  }

  public get isMe() {
    return this._isMe();
  }

  
}
