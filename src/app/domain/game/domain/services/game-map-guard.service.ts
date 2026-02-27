import { inject, Injectable } from '@angular/core';
import { CanActivate, GuardResult, Router } from '@angular/router';
import { LobbyStore, environment } from '@catan/core';

@Injectable({
  providedIn: 'root'
})
export class GameMapGuardService implements CanActivate {
  private readonly _lobbyStore = inject(LobbyStore);
  private readonly _router = inject(Router);
  

  canActivate(): GuardResult {
    const hasMap = this._lobbyStore.getMapData() !== null;
    const hasAccess = hasMap || !environment.prod;
    if (!hasAccess) {
      this._router.navigate(['/lobby']);
    }
    return hasAccess;
  }
}
