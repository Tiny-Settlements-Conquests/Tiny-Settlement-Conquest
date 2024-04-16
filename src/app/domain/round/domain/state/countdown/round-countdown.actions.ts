import { createAction, props  } from '@ngneat/effects';
import { RoundCountdown } from '../../models/round-countdown.model';

export class RoundCountdownActions {
    public static setRoundCountdown = createAction('[roundcountdown] set', props<RoundCountdown>());

}