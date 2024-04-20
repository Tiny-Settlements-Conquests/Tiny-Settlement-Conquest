import { BuildCostManager } from "../../../buildings/domain/classes/build-cost-manager";
import { BuildingBuildManager } from "../../../buildings/domain/classes/building-build-manager";
import { RoadBuildManager } from "../../../buildings/domain/classes/road-build-manager";
import { ResourceInventory } from "../../../inventory/domain/classes/resource-inventory";
import { Playground } from "../../../playground/domain/classes/playground";
import { Round } from "../../../round/domain/classes/round";

export interface GameConfig {
    resourceMultiplier: number,
    maxTownsPerPlayer: number,
    maxCitiesPerPlayer: number,
    maxRoadsPerPlayer: number,
    winPoints: number,
    maxRoundTimer: number,
    maxRollTimer: number,
  }
  
export interface GameDependencies {
    playground: Playground,
    round: Round,
    bank: ResourceInventory,
    roadBuildManager: RoadBuildManager,
    buildingBuildManager: BuildingBuildManager,
    buildCostManager: BuildCostManager
  }