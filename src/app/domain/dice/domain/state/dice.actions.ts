import { createAction, props } from '@ngneat/effects';
import { Dices } from '../models/dice.model';

export class DiceActions {
    public static readonly resetDices = createAction('[diceActions Store] reset Dices');
    public static readonly updateDiceOverlayOpenState = createAction('[diceActions Store] open overlay', props<{isOpen: boolean}>());
    public static readonly setDices = createAction('[diceActions Store] set dices', props<{dices: Dices}>());
}