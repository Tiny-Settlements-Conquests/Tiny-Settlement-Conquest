import { createStore, withProps, select } from '@ngneat/elf';
import { map, of, switchMap } from 'rxjs';
import { getActiveEntity, getAllEntities, getEntity, selectActiveEntity, selectAllEntities, setActiveId, setEntities, withActiveId, withEntities } from '@ngneat/elf-entities';
import { Injectable, inject } from '@angular/core';
import { RoundPlayer } from '../models/round-player.model';
import { UserRepository } from '../../../user/domain/state/user.repository';
import { Player } from '../../../player/domain/classes/player';

const roundPlayerStore = createStore(
    { name: 'roundPlayers' },
    withEntities<Player>(),
    withActiveId()
);

@Injectable(
  { providedIn: 'root' }
)
export class RoundPlayerRepository {
  private readonly _userRepository = inject(UserRepository);

  public setRoundPlayers(roundPlayers: Player[]) {
    roundPlayerStore.update(setEntities(roundPlayers));
  }

  public selectRoundPlayers() {
    return roundPlayerStore.pipe(selectAllEntities())
  }

  public selectActiveRoundPlayer() {
    return roundPlayerStore.pipe(selectActiveEntity())
  }

  public updateActiveRoundPlayer(roundPlayerId: Player['id']) {
    roundPlayerStore.update(setActiveId(roundPlayerId))
  }

  public getRoundPlayers() {
    return roundPlayerStore.query(getAllEntities());
  }

  public getActiveRoundPlayer() {
    return roundPlayerStore.query(getActiveEntity());
  }

  public selectMe() {
    return this._userRepository.selectUser().pipe(
      switchMap((user) => {
        if(!user) return of(undefined);
        return this.selectRoundPlayers().pipe(
          map((roundPlayers) => {
            return roundPlayers.find(roundPlayer => roundPlayer.id === user.id);
          })
        )
      })
    )
  }

  public selectIsMyTurn() {
    return this.selectMe().pipe(
      switchMap((player) => {
        return this.selectActiveRoundPlayer().pipe(
          map((activeRoundPlayer) => {
            if(!activeRoundPlayer) return false;
            return activeRoundPlayer.id === player?.id;
          })
        )
      })
    )
  }

}
