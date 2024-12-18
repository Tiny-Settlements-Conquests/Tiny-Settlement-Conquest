import { Player } from "../../../player/domain/classes/player";

export type NextRoundEvents = 'nextRound';

export type NextRoundEventsParamsMap = {
    'nextRound': null
}

export interface RoundInformation {
    roundNumber: number;
    activePlayer: Player;
}