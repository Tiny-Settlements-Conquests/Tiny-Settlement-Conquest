import { User } from "../../../player/domain/classes/player";

export interface RoundPlayer extends User {
    color: string;
    resourceCardCount: number;
    winningPoints: number;
    researchCardCount: number;
    isBot: boolean;
}