import { Game } from "../../../game/domain/classes/game";
import { Player } from "../../../player/domain/classes/player";

export type BotPlayer = Exclude<Player, 'id'>;
export type BotUser = {
    name: string;
    profileUrl: string;
}

export interface Bot {
    makeMove(game: Game, player: Player): void
}


export type BotPriority = 'build' | 'trade' | 'endRound'