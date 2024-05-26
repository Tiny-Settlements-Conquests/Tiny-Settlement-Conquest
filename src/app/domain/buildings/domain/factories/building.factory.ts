import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";
import { City } from "../classes/city";
import { Building, BuildingType } from "../models/building.model";

export class BuildingFactory {

    public constructBuilding(type: BuildingType, owner: Player, graphNode: GraphNode): Building {
        if(type === BuildingType.CITY) {
            return new City(type, owner, graphNode, 2);
        } else if (type === BuildingType.TOWN) {
            return new City(type, owner, graphNode, 1);
        }
        throw new Error("Unknown building type!");
    }
}