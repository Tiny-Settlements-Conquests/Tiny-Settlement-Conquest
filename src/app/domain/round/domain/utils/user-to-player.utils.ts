import { LobbyUser } from "../../../lobby/domain/models/lobby.model";
import { RoundPlayer } from "../models/round-player.model";

const colors = ['#CD5C5C', '#22c55e', '#6B46C1']
export function usersToPlayers(users: LobbyUser[]): RoundPlayer[] {
    return users.map((user, idx) => ({
        ...user,
        isBot: user.isRobot,
        color: colors[idx % colors.length],
        researchCardCount: 0,
        resourceCardCount: 0,
        winningPoints: 0,
    }));
}