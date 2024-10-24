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
        profileUrl: 'assets/robot.png',
        isHost: true,
        name: 'xScodayx',
        ready: true
      },
      isOpen: true
    },
    {
      player: {
        id: '1412523',
        profileUrl: 'assets/robot.png',
        isHost: false,
        name: 'Dream43',
        ready: false
      },
      isOpen: true
    },
    {
      player: {

        id: '1412541241',
        profileUrl: 'assets/robot.png',
        isHost: false,
        name: 'Woody',
        ready: false
      },
      isOpen: true
    },
    {
      player: {
        id: '646546',
        profileUrl: 'assets/robot.png',
        isHost: false,
        name: 'Timmy',
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
