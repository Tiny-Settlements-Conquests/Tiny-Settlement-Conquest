import { createAction, props } from '@ngneat/effects';
import { GameMode } from '../models/game-mode.model';

export class GameModeActions {
    public static readonly updateMode = createAction('[gameMode Store] updateMode', props<{mode: GameMode}>());
}