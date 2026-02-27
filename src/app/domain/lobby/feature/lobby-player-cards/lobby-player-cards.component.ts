import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCrown, faX } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../button/button/button.component';
import { UserStore, LobbyStore } from '@catan/core';
import { DEFAULT_WINNING_POINTS, MAX_PLAYER_COUNT } from '@catan/shared/models';
import { generateRandomLobbyRobot } from '../../domain/utils/lobby.utils';



@Component({
    selector: 'app-lobby-player-cards',
    imports: [
        FaIconComponent,
        ButtonComponent
    ],
    templateUrl: './lobby-player-cards.component.html',
    styleUrl: './lobby-player-cards.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LobbyPlayerCardsComponent {
  private readonly _lobbyStore = inject(LobbyStore)
  private readonly _userStore = inject(UserStore);

  public readonly me = this._userStore.user;

  public readonly users = this._lobbyStore.users;

  public readonly isMaxUsers = this._lobbyStore.isMaxPlayers;

  constructor() {
    effect(() => {
      const me = this._userStore.user();
      if(!me) return;
      this._lobbyStore.setUsers([{...me, isRobot: false}, generateRandomLobbyRobot()])
    });
  }

  public kickPlayer(id: string) {
    this._lobbyStore.removePlayer(id);
  }

  public addPlayer() {
    this._lobbyStore.addPlayer(generateRandomLobbyRobot());
  }

  public readonly icons = {
    crown: faCrown,
    x: faX
  };
}
