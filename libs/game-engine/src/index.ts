// @catan/game-engine — Public API
//
// Pure TypeScript game engine — NO Angular dependencies.
// This library contains all the OOP game logic classes.
// Angular components interact with this engine ONLY through the EventGateway interface
// and the GameEventDispatcherService (which bridges engine events → Signal Stores).

// Core game class
export { Game } from '../../../src/app/domain/game/domain/classes/game';
export { GamePhaseController } from '../../../src/app/domain/game/domain/classes/game-phase.class';
export { GameRoundController } from '../../../src/app/domain/game/domain/classes/game-round.class';
export { GameStateController } from '../../../src/app/domain/game/domain/classes/game-state.class';
export { GameTimeController } from '../../../src/app/domain/game/domain/classes/game-timer.class';

// Round
export { Round } from '../../../src/app/domain/round/domain/classes/round';

// Player
export { Player } from '../../../src/app/domain/player/domain/classes/player';

// Dice
export { DiceRoller } from '../../../src/app/domain/dice/domain/classes/dice-roller';

// Trade
export { TradeManager } from '../../../src/app/domain/trade/domain/classes/trade-manager';

// Resources
export { ResourceDistributor } from '../../../src/app/domain/resources/domain/classes/resources/resource-distributor';

// Inventory
export { ResourceInventory } from '../../../src/app/domain/inventory/domain/classes/resource-inventory';
export { WinningpointsInventory } from '../../../src/app/domain/inventory/domain/classes/winningpoints-inventory';

// Buildings
export { BuildCostManager } from '../../../src/app/domain/buildings/domain/classes/build-cost-manager';
export { BuildingBuildManager } from '../../../src/app/domain/buildings/domain/classes/building-build-manager';
export { RoadBuildManager } from '../../../src/app/domain/buildings/domain/classes/road-build-manager';
export { BuildingFactory } from '../../../src/app/domain/buildings/domain/factories/building.factory';
export { GraphBuildingNode } from '../../../src/app/domain/buildings/domain/graph/graph-building-node';

// Playground
export { Playground } from '../../../src/app/domain/playground/domain/classes/playground';

// Graph
export { Graph } from '../../../src/app/domain/graph/domain/classes/graph';
export { GraphNode } from '../../../src/app/domain/graph/domain/classes/graph-node';
export { GraphConnection } from '../../../src/app/domain/graph/domain/classes/graph-connection';

// Robber
export { RobberManager } from '../../../src/app/domain/robber/domain/classes/robber-manager';

// Bot
export { MediumBot } from '../../../src/app/domain/bot/domain/classes/medium-bot';

// Utils
export { loadPlayground } from '../../../src/app/domain/game/domain/utils/game-loader.utils';
export { usersToPlayers } from '../../../src/app/domain/round/domain/utils/user-to-player.utils';
