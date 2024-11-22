import { Game } from "../../../game/domain/classes/game";
import { Player } from "../../../player/domain/classes/player";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";

export type BotPlayer = Exclude<Player, 'id'>;
export type BotUser = {
    name: string;
    profileUrl: string;
}

export interface Bot {
    makeMove(game: Game, player: RoundPlayer): void
}


export type BotPriority = 'build' | 'trade' | 'endRound'