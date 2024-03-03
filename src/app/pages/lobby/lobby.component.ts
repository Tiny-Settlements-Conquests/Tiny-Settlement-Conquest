import { ChangeDetectionStrategy, Component, signal, type OnInit, computed } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightToBracket, faCheckCircle, faCircleXmark, faCross, faCrown, faDice, faFile, faPlay } from '@fortawesome/free-solid-svg-icons';
import { CanvasComponent } from '../../domain/game/feature/canvas/canvas.component';
import { BlockComponent } from '../../domain/layouts/ui/block/block.component';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MapPreviewComponent } from '../../domain/game/feature/map-preview/map-preview.component';

interface PlayerSlot {
  player: Player | null;
  isOpen: boolean;
}

export interface Player {
  id: string;
  profileUrl: string;
  isHost: boolean;
  name: string;
  ready: boolean
}

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CanvasComponent,
    BlockComponent,
    TitleComponent,
    RouterLink,
    NgClass,
    MapPreviewComponent
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyComponent implements OnInit {
  public readonly icons = {
    crown: faCrown,
    checkmark: faCheckCircle,
    cross: faCircleXmark,
    dice: faDice,
    file: faFile,
    play: faPlay,
    bracketArrow: faArrowRightToBracket
  }

  ngOnInit(): void { }

  public slots = signal<(PlayerSlot)[]>([
    {
      player: {
        id: '14124',
        profileUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO2F0VxhmZzAFM54PA95eDdtkEtHlZDga9ew&usqp=CAU',
        isHost: true,
        name: 'Clemens S.',
        ready: true
      },
      isOpen: true
    },
    {
      player: {
        id: '1412523',
        profileUrl: 'https://media.gq-magazine.co.uk/photos/5f0d7b425a8518ef1776783c/master/w_1600%2Cc_limit/20200714-mercedes-05.jpg',
        isHost: false,
        name: 'Tom S.',
        ready: false
      },
      isOpen: true
    },
    {
      player: {

        id: '1412541241',
        profileUrl: 'https://avatars.githubusercontent.com/u/1330321?v=4',
        isHost: false,
        name: 'Andreas Dost',
        ready: false
      },
      isOpen: true
    },
    {
      player: {
        id: '646546',
        profileUrl: 'https://avatars.githubusercontent.com/u/1330321?v=4',
        isHost: false,
        name: 'Christine D.',
        ready: true
      },
      isOpen: true
    },
    {
      player: null,
      isOpen: true
    }
  ]);
  
  public playerCount = computed(() => this.slots().filter(p => p.player !== null).length);

  public maxPlayers = computed(() => {
    return this.slots().filter(p => p.isOpen == true).length
  });

  public canStart = computed(() => {
    return this.slots().filter(p => p.player !== null && p.player.ready == true).length == this.playerCount();
  })

  public toggleIsOpen(index: number) {
    this.slots.update((old) => {
      old[index].isOpen =!old[index].isOpen;
      return [...old];
    });
  }
}
