import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActionCardComponent } from '../../../cards/feature/action-card/action-card.component';
import { Player, User } from '../../domain/classes/player';
import { NgStyle } from '@angular/common';
import { RoundPlayer } from '../../../round/domain/models/round-player.model';


//todo checken ob das überhaupt sinn ergibt, eig. nicht -> ist ja schon als round-player-card implementiert
@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [
    BlockComponent,
    FontAwesomeModule,
    ActionCardComponent,
    NgStyle
  ],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerCardComponent {
  public icons = {
    question: faQuestion
  }

  private readonly _player = signal<RoundPlayer | null>(null);

  @Input({required: true})
  public set player(v: RoundPlayer) {
    this._player.set(v);
  }

  public get player(): RoundPlayer | null {
    return this._player();
  }

  private readonly _isMe = signal<boolean>(false);
  
  @Input()
  public set isMe(v: boolean) {
    this._isMe.set(v);
  }

  public get isMe() {
    return this._isMe();
  }

  
}
