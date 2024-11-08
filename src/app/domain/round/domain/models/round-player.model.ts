import { Player } from "../../../player/domain/models/player.model";

export interface RoundPlayer extends Player {
    color: string;
    resourceCardCount: number;
    winningPoints: number;
    researchCardCount: number;
    isBot: boolean;
}