import { Game } from "../../../game/domain/classes/game";
import { Player } from "../../../player/domain/classes/player";

export interface Bot {
    makeMove(game: Game, player: Player): void
}


export type BotPriority = 'build' | 'trade' | 'endRound'