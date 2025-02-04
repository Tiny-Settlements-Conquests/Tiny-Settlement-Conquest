import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { setEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { RoundPlayer } from "../models/round-player.model";
import { computed, inject, Inject } from "@angular/core";
import { UserRepository } from "../../../user/domain/state/user.repository";

type DiceState = {
    activePlayerId: RoundPlayer['id'] | undefined;
};
  
const initialState: DiceState = {
    activePlayerId: undefined,
};

export const RoundPlayerStore = signalStore(
    withEntities<RoundPlayer>(),
    withState(initialState),
    withComputed((store, userStore = inject(UserRepository)) => ({
        activeRoundPlayer: computed(() => {
            const players = store.entityMap();
            const activeId = store.activePlayerId();
            if(!activeId) return undefined;
            return players[activeId];
        }),
        me: computed(() => {
            const me = userStore.getUser();
            const players = store.entityMap();
            if(!me) return undefined;
            return players[me.id];
        }),
        isMyTurn: computed(() => {
            const activeRoundPlayerId = store.activePlayerId();
            const me = userStore.getUser(); // todo replace by signal store
            return me?.id === activeRoundPlayerId;
        }),
        roundPlayersExceptMe: computed(() => {
            const me = userStore.getUser();
            return store.entities().filter((e) => e.id !== me?.id)
        })
    })),
    withMethods((store) => ({
        setWinningPointsForPlayer(points: number, playerId: RoundPlayer['id']) {
            patchState(store, updateEntity({id: playerId, changes: (entity) => ({...entity, winningPoints: points})}))
        },
        setRoundPlayers(players: RoundPlayer[]) {
            patchState(store, setEntities(players));
        },
        setActiveRoundPlayerById(id: string) {
            patchState(store, {
                activePlayerId: id
            })
        }
    }))
);