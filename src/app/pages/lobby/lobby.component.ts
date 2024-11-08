import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightToBracket, faCheckCircle, faCircleXmark, faCrown, faDice, faGear, faMap, faPlay } from '@fortawesome/free-solid-svg-icons';
import { CanvasComponent } from '../../domain/game/feature/canvas/canvas.component';
import { MapPreviewComponent } from '../../domain/game/feature/map-preview/map-preview.component';
import { BlockComponent } from '../../domain/layouts/ui/block/block.component';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { LobbyPlayerCardsComponent } from '../../domain/lobby/feature/lobby-player-cards/lobby-player-cards.component';
import { BackArrowComponent } from '../../domain/layouts/ui/back-arrow/back-arrow.component';
import { ButtonComponent } from '../../domain/button/button/button.component';
import { LobbyRepository } from '../../domain/lobby/domain/state/repository';
import { toSignal } from '@angular/core/rxjs-interop';
import { GameLoaderComponent } from '../../domain/loading/feature/game-loader/game-loader.component';


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
    ButtonComponent,
    GameLoaderComponent
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyComponent {
  private readonly _lobbyRepository = inject(LobbyRepository);

  public readonly gameStarted = signal(false);

  public readonly icons = {
    crown: faCrown,
    checkmark: faCheckCircle,
    cross: faCircleXmark,
    gear: faGear,
    map: faMap,
    play: faPlay,
    bracketArrow: faArrowRightToBracket
  }

  private readonly selectUsers = toSignal(
    this._lobbyRepository.selectUsers()
  )

  public readonly selectedMap = toSignal(
    this._lobbyRepository.selectMapData()
  )

  public canStart = computed(() => {
    const users = this.selectUsers();
    const map = this.selectedMap()
    if(!users || !map) return false;
    return users.length > 1;
  })

 

  public toggleIsOpen(index: number) {
    
  }

  public startGame() {
    this.gameStarted.set(true);
  }
}
