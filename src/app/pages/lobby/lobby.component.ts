import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightToBracket, faCheckCircle, faCircleXmark, faCrown, faDice, faMap, faPlay } from '@fortawesome/free-solid-svg-icons';
import { CanvasComponent } from '../../domain/game/feature/canvas/canvas.component';
import { MapPreviewComponent } from '../../domain/game/feature/map-preview/map-preview.component';
import { BlockComponent } from '../../domain/layouts/ui/block/block.component';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { LobbyPlayerCardsComponent } from '../../domain/lobby/feature/lobby-player-cards/lobby-player-cards.component';
import { BackArrowComponent } from '../../domain/layouts/ui/back-arrow/back-arrow.component';

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
    MapPreviewComponent,
    LobbyPlayerCardsComponent,
    BackArrowComponent,
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
    map: faMap,
    play: faPlay,
    bracketArrow: faArrowRightToBracket
  }

  ngOnInit(): void { }

  public canStart = computed(() => {
    return true;
  })

  public toggleIsOpen(index: number) {
    
  }
}
