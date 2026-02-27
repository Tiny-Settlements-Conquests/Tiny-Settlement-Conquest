import { ComponentRef, effect, inject, Injectable, Injector } from '@angular/core';
import { GAME_COMPONENT_REF_TOKEN } from '../../game/domain/tokens/game-component-ref.token';
import { GameStateStore } from '../../game/domain/state/game-state.store';
import { PauseOverlayComponent } from '../feature/pause-overlay/pause-overlay.component';
import { GAME_STATE } from '@catan/shared/models';

@Injectable({
  providedIn: 'any'
})
export class PauseOverlaySyncService {
  private readonly _hostRef = inject(GAME_COMPONENT_REF_TOKEN);
  private readonly _gameStateStore = inject(GameStateStore)
  private readonly _injector = inject(Injector);
  private _pauseOverlayRef: undefined | ComponentRef<PauseOverlayComponent> = undefined;
  
  constructor() {
    effect(() => {
      this.closePauseOverlay();
      const state = this._gameStateStore.state();
      console.log("PAUSED!?", state)
      if(state === GAME_STATE.PAUSE) {
        this.openPauseOverlay();
        console.log("hi")
      }
    })
  }

  private openPauseOverlay() {
    const component = this._hostRef.createComponent(PauseOverlayComponent, {
        injector: this._injector
      });
      this._pauseOverlayRef = component;
  }

  private closePauseOverlay() {
    if(this._pauseOverlayRef === undefined) return;
    this._pauseOverlayRef.destroy();
    this._pauseOverlayRef = undefined;
  }

}
