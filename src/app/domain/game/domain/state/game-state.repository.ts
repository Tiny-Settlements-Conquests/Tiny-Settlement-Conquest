// import { createStore, withProps, select } from '@ngneat/elf';
// import { GameMode } from '../models/game-mode.model';
// import { map } from 'rxjs';
// import { getEntity } from '@ngneat/elf-entities';
// import { Injectable } from '@angular/core';

// const gameStateStore = createStore(
//     { name: 'gameState' },
//     withProps<{mode: GameMode}>({ mode: 'spectate' })
// );

// @Injectable(
//   { providedIn: 'root' }
// )
// export class GameStateRepository {
//   public updateMode(mode: GameMode) {
//     gameModeStore.update(state => ({ mode }))
//   }

//   public selectMode() {
//     return gameModeStore.pipe(map(({mode}) => mode))
//   }

//   public getMode() {
//     return gameModeStore.query(state => state.mode)
//   }
// }
