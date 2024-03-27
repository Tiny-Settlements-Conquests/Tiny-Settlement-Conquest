import { createStore, withProps, select } from '@ngneat/elf';
import { map } from 'rxjs';
import { getActiveEntity, getAllEntities, getEntity, selectActiveEntity, selectAllEntities, setActiveId, setEntities, withActiveId, withEntities } from '@ngneat/elf-entities';
import { Injectable } from '@angular/core';
import { RoundPlayer } from '../models/round-player.model';

const roundPlayerStore = createStore(
    { name: 'roundPlayers' },
    withEntities<RoundPlayer>(),
    withActiveId()
);

@Injectable(
  { providedIn: 'root' }
)
export class RoundPlayerRepository {

  public setRoundPlayers(roundPlayers: RoundPlayer[]) {
    roundPlayerStore.update(setEntities(roundPlayers));
  }

  public selectRoundPlayers() {
    return roundPlayerStore.pipe(selectAllEntities())
  }

  public selectActiveRoundPlayer() {
    return roundPlayerStore.pipe(selectActiveEntity())
  }

  public updateActiveRoundPlayer(roundPlayerId: RoundPlayer['id']) {
    roundPlayerStore.update(setActiveId(roundPlayerId))
  }

  public getRoundPlayers() {
    return roundPlayerStore.query(getAllEntities());
  }

  public getActiveRoundPlayer() {
    return roundPlayerStore.query(getActiveEntity());
  }

  public nextRoundPlayer() {
    const activeRoundPlayer = this.getActiveRoundPlayer();
    if(!activeRoundPlayer) return;

    const roundPlayers = this.getRoundPlayers();
    const activeIndex = roundPlayers.indexOf(activeRoundPlayer);
    let nextIndex = activeIndex + 1;
    if(nextIndex >= roundPlayers.length) {
      nextIndex = 0;
    }
    this.updateActiveRoundPlayer(roundPlayers[nextIndex].id);
  }

}
