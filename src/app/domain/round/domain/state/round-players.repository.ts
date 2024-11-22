import { createStore, withProps, select } from '@ngneat/elf';
import { filter, map, of, switchMap } from 'rxjs';
import { getActiveEntity, getAllEntities, getEntity, selectActiveEntity, selectAllEntities, setActiveId, setEntities, updateEntities, upsertEntitiesById, withActiveId, withEntities } from '@ngneat/elf-entities';
import { Injectable, inject } from '@angular/core';
import { RoundPlayer } from '../models/round-player.model';
import { UserRepository } from '../../../user/domain/state/user.repository';
import { Player } from '../../../player/domain/classes/player';

const roundPlayerStore = createStore(
    { name: 'roundPlayers' },
    withEntities<RoundPlayer>(),
    withActiveId()
);

@Injectable(
  { providedIn: 'root' }
)
export class RoundPlayerRepository {
  private readonly _userRepository = inject(UserRepository);

  public setRoundPlayers(roundPlayers: RoundPlayer[]) {
    roundPlayerStore.update(setEntities(roundPlayers));
  }

  public setWinningPointsForPlayer(points: number, playerId: RoundPlayer['id']) {
    roundPlayerStore.update(updateEntities(playerId, ((entity) => ({
          ...entity,
          winningPoints: points
        })),
    ));
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

  public getMe() {
    const players = this.getRoundPlayers();
    const me = this._userRepository.getUser()
    return players.find(x => x.id === me?.id);
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

  public selectRoundPlayersExceptMe() {
    return roundPlayerStore.pipe(
      selectAllEntities(),
      switchMap((players) => this.selectMe().pipe(
        filter((me) => me !== undefined),
        map((me) => players.filter((p) => p.id !== me.id))
      ))
    )
  }

}
