import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { Player } from '../../../../pages/lobby';

@Component({
  selector: 'app-players-cards',
  standalone: true,
  imports: [
    BlockComponent
  ],
  templateUrl: './players-cards.component.html',
  styleUrl: './players-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersCardsComponent {
  public players = signal<Player[]>([
    {
      id: '14124',
        profileUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO2F0VxhmZzAFM54PA95eDdtkEtHlZDga9ew&usqp=CAU',
        isHost: true,
        name: 'Clemens S.',
        ready: true
    },
    {
      id: '1412523',
      profileUrl: 'https://media.gq-magazine.co.uk/photos/5f0d7b425a8518ef1776783c/master/w_1600%2Cc_limit/20200714-mercedes-05.jpg',
      isHost: false,
      name: 'Tom S.',
      ready: false
    },
    {
      id: '1412541241',
        profileUrl: 'https://avatars.githubusercontent.com/u/1330321?v=4',
        isHost: false,
        name: 'Andreas Dost',
        ready: false
    },
    {
      id: '646546',
      profileUrl: 'https://avatars.githubusercontent.com/u/1330321?v=4',
      isHost: false,
      name: 'Christine D.',
      ready: true
    }
  ])

 }
