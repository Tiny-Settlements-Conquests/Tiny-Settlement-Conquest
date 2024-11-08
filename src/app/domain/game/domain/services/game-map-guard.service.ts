import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { LobbyRepository } from '../../../lobby/domain/state/repository';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameMapGuardService implements CanActivate {
  private readonly _lobbyRepository = inject(LobbyRepository);
  private readonly _router = inject(Router);
  

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GuardResult> {
    return this._lobbyRepository.selectMapData().pipe(
      map((map) => map !== null),
      tap((hasAccess) => !hasAccess ? this._router.navigate(['/lobby']) : '')
    )
  }
}
