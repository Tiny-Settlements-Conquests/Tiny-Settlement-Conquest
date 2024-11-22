import { Player } from "../../../player/domain/classes/player";

export interface RoundInformation {
    roundNumber: number;
    activePlayer: Player;
}