import { PlaceableType } from "../../../buildings/domain/models/building.model";
import { Dices } from "../../../dice/domain/models/dice.model";
import { Player } from "../../../player/domain/classes/player";
import { ResourceCard } from "../../../resources/domain/models/resource-card.model";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";

export type HistoryAction = (BuildAction | TradeAction | DiceAction | ResourceAction) & { id: string };

export type BuildAction = {
    typ: 'build',
    player: RoundPlayer,
    building: PlaceableType
}

export type TradeAction = {
    typ: 'trade',
    player: RoundPlayer,
    playerB: RoundPlayer,
    givenResources: ResourceCard[],
    receivedResources: ResourceCard[],
}

export type DiceAction = {
    typ: 'dice',
    player: RoundPlayer,
    dice: Dices
}

export type ResourceAction = {
    typ: 'resource',
    player: RoundPlayer,
    receivedResources: ResourceCard[]
}