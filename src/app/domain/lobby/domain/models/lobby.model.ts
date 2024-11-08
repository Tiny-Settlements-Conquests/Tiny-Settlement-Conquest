import { MapInformation } from "../../../map-selection/domain/models/map-selection.model";
import { User } from "../../../user/domain/models/user.model";

export const MAX_PLAYER_COUNT = 4;
export const DEFAULT_WINNING_POINTS = 10;

export interface LobbyUser extends User {
  isRobot: boolean;
};

export interface LobbySettings {
    maxPlayers: number;
    users: LobbyUser[];
    winningPoints: number;
    mapData: MapInformation | null;
}