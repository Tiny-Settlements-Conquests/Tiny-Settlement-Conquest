import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCrown, faX } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';
import { ButtonComponent } from '../../../button/button/button.component';
import { UserRepository } from '../../../user/domain/state/user.repository';
import { LobbyRepository } from '../../domain/state/repository';
import { generateRandomLobbyRobot } from '../../domain/utils/lobby.utils';
import { DEFAULT_WINNING_POINTS, MAX_PLAYER_COUNT } from '../../domain/models/lobby.model';



@Component({
  selector: 'app-lobby-player-cards',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent,
    ButtonComponent
  ],
  templateUrl: './lobby-player-cards.component.html',
  styleUrl: './lobby-player-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyPlayerCardsComponent {
  private readonly _lobbyRepository = inject(LobbyRepository)
  private readonly _userRepository = inject(UserRepository);

  public readonly me = toSignal(
    this._userRepository.selectUser().pipe(
      tap((me) => {
        if(!me) return;
        this._lobbyRepository.setUsers([{...me, isRobot: false}, generateRandomLobbyRobot()])
      })
    )
  )

  public readonly users = toSignal(
    this._lobbyRepository.selectUsers()
  )

  public readonly isMaxUsers = toSignal(
    this._lobbyRepository.selectIsMaxPlayers()
  )

  public kickPlayer(id: string) {
    this._lobbyRepository.removePlayer(id);
  }

  public addPlayer() {
    this._lobbyRepository.addPlayer(generateRandomLobbyRobot());
  }

  public readonly icons = {
    crown: faCrown,
    x: faX
  };
}
