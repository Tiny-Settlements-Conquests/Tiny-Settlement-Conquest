import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { Player } from '../../../../pages/lobby';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActionCardComponent } from '../../../cards/feature/action-card/action-card.component';
import { User } from '../../domain/classes/player';
import { RoundPlayer } from '../../../round/domain/models/round-player.model';
import { NgStyle } from '@angular/common';


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
}
