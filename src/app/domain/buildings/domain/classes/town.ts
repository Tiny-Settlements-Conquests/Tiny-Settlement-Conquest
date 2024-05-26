import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";
import { Building, BuildingType } from "../models/building.model";

export class Town implements Building {
    public constructor(
        public readonly type: BuildingType,
        public readonly owner: Player,
        public readonly graphNode: GraphNode,
        public readonly winningPoints: number = 1
    ) {}
}