import { createAction, props } from '@ngneat/effects';
import { RoundPlayer } from '../models/round-player.model';

export class RoundPlayerActions {
    public static readonly setRoundPlayers = createAction('[roundplayer Store] set round players', props<{players: RoundPlayer[]}>());
    public static readonly setWinningPointsForPlayer = createAction('[roundplayer Store] setWinningPoints for player', props<{
        playerId: RoundPlayer['id']; //TODO build a proper type!
        amount: number
    }>());
    public static readonly updateActiveRoundPlayer = createAction('[roundplayer Store] set active round player', props<{playerId: RoundPlayer['id']}>())

}