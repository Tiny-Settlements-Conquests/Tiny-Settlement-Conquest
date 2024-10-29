import { User } from "../../../user/domain/models/user.model";

export interface RoundPlayer extends User {
    color: string;
    resourceCardCount: number;
    winningPoints: number;
    researchCardCount: number;
    isBot: boolean;
}