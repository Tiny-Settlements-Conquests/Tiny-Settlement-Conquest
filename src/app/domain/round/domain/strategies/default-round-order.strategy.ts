import { Round } from "../classes/round";
import { RoundOrderStrategy } from "../models/round-order.model";

export function defaultOrderStrategy(round: Round): RoundOrderStrategy {
    return { 
        nextRound : () => {
            const activeIndex = round.activePlayerIndex;
            let nextIndex = activeIndex + 1;
            if(nextIndex >= round.players.length) {
                nextIndex = 0;
            }
            try {
                const player = round.getPlayerByIndex(nextIndex);
                round.setNewRound(player.id);
            } catch {}
        }
    }
}