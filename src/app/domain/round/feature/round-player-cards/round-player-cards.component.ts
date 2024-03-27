import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { User } from '../../../player/domain/classes/player';
import { PlayerCardComponent } from '../../../player/feature/players-card/player-card.component';
import { RoundPlayerRepository } from '../../domain/state/round-players.repository';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-round-player-cards',
  standalone: true,
  imports: [
    PlayerCardComponent,
    NgClass
  ],
  templateUrl: './round-player-cards.component.html',
  styleUrl: './round-player-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundPlayerCardsComponent { 
  private readonly _roundPlayerRepository = inject(RoundPlayerRepository);
  
  public readonly players = toSignal(
    this._roundPlayerRepository.selectRoundPlayers()
  );

  public readonly activePlayer = toSignal(
    this._roundPlayerRepository.selectActiveRoundPlayer()
  )

  constructor() {
    //todo this is only temporary
    this._roundPlayerRepository.setRoundPlayers([
        {
          id: '14124',
          color: '#CD5C5C',
          profileUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO2F0VxhmZzAFM54PA95eDdtkEtHlZDga9ew&usqp=CAU',
          name: 'Clemens S.',
          researchCardCount: 5,
          resourceCardCount: 5,
          winningPoints: 1,
          isControlable: true,
        },
        {
          id: '1412523',
          color: '#22c55e',
          profileUrl: 'https://media.gq-magazine.co.uk/photos/5f0d7b425a8518ef1776783c/master/w_1600%2Cc_limit/20200714-mercedes-05.jpg',
          name: 'Tom S.',
          researchCardCount: 4,
          resourceCardCount: 2,
          winningPoints: 3,
          isControlable: true,
        },
        {
          id: '1412541241',
          color: '#6B46C1',
          profileUrl: 'https://avatars.githubusercontent.com/u/1330321?v=4',
          name: 'Andreas Dost',
          researchCardCount: 6,
          resourceCardCount: 3,
          winningPoints: 1,
          isControlable: true,
        },
        {
          id: '646546',
          color: '#000000',
          profileUrl: 'https://avatars.githubusercontent.com/u/1330321?v=4',
          name: 'Christine D.',
          researchCardCount: 1,
          resourceCardCount: 4,
          winningPoints: 5,
          isControlable: true,
        }
      ]
    )
    this._roundPlayerRepository.updateActiveRoundPlayer('14124')

  }
}
