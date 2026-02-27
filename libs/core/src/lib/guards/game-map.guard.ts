import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LobbyStore } from '../state/lobby.store';
import { DEV_TOKEN } from '../tokens/tokens';

/**
 * Functional route guard — prevents navigation to /game if no map is selected.
 * In dev mode, navigation is always allowed for easier testing.
 */
export const canActivateGame: CanActivateFn = () => {
  const lobbyStore = inject(LobbyStore);
  const router = inject(Router);
  const isDev = inject(DEV_TOKEN);

  const hasMap = lobbyStore.selectedMap() !== null;

  if (hasMap || isDev) {
    return true;
  }

  return router.createUrlTree(['/lobby']);
};
