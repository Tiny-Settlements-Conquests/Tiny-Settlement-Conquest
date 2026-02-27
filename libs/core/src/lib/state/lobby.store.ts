import { computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import {
  LobbyUser,
  LobbySettings,
  MapInformation,
  MAX_PLAYER_COUNT,
  DEFAULT_WINNING_POINTS,
} from '@catan/shared/models';

const initialState: LobbySettings = {
  maxPlayers: MAX_PLAYER_COUNT,
  users: [],
  winningPoints: DEFAULT_WINNING_POINTS,
  mapData: null,
};

/**
 * LobbyStore — Global singleton store for lobby settings.
 * Replaces the old Elf-based LobbyRepository.
 */
export const LobbyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isMaxPlayers: computed(() => store.users().length >= store.maxPlayers()),
    selectedMap: computed(() => store.mapData()),
  })),
  withMethods((store) => ({
    updateSettings(settings: Partial<LobbySettings>): void {
      patchState(store, settings);
    },
    setUsers(users: LobbyUser[]): void {
      patchState(store, { users });
    },
    addPlayer(user: LobbyUser): void {
      patchState(store, { users: [...store.users(), user] });
    },
    removePlayer(id: string): void {
      patchState(store, { users: store.users().filter((u) => u.id !== id) });
    },
    setMapData(data: MapInformation): void {
      patchState(store, { mapData: data });
    },
    getUsers(): LobbyUser[] {
      return store.users();
    },
    getMapData(): MapInformation | null {
      return store.mapData();
    },
  }))
);
