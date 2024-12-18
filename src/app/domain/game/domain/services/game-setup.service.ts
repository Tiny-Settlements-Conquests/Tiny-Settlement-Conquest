import { inject, Injectable } from '@angular/core';
import { Playground } from '../../../playground/domain/classes/playground';
import { DEV_TOKEN } from '../../../../utils/tokens/dev.token';
import { BuildingFactory } from '../../../buildings/domain/factories/building.factory';
import { GraphBuildingNode } from '../../../buildings/domain/graph/graph-building-node';
import { BuildingType } from '../../../buildings/domain/models/building.model';
import { Player } from '../../../player/domain/classes/player';
import { Graph } from '../../../graph/domain/classes/graph';
import { ResourceInventory } from '../../../inventory/domain/classes/resource-inventory';
import { WinningpointsInventory } from '../../../inventory/domain/classes/winningpoints-inventory';
import { Round } from '../../../round/domain/classes/round';
import { RoundPlayer } from '../../../round/domain/models/round-player.model';
import { Game } from '../classes/game';
import { loadPlayground } from '../utils/game-loader.utils';
import { usersToPlayers } from '../../../round/domain/utils/user-to-player.utils';
import { BuildCostManager } from '../../../buildings/domain/classes/build-cost-manager';
import { BuildingBuildManager } from '../../../buildings/domain/classes/building-build-manager';
import { RoadBuildManager } from '../../../buildings/domain/classes/road-build-manager';
import { DiceRoller } from '../../../dice/domain/classes/dice-roller';
import { ResourceDistributor } from '../../../resources/domain/classes/resources/resource-distributor';
import { RobberManager } from '../../../robber/domain/classes/robber-manager';
import { TradeManager } from '../../../trade/domain/classes/trade-manager';
import { MapInformation } from '../../../map-selection/domain/models/map-selection.model';
import { LobbyUser } from '../../../lobby/domain/models/lobby.model';
import { MapSelectionService } from '../../../map-selection/domain/services/map-selection.service';
import { generateRandomLobbyRobot } from '../../../lobby/domain/utils/lobby.utils';
import { UserRepository } from '../../../user/domain/state/user.repository';
import { LobbyRepository } from '../../../lobby/domain/state/repository';

@Injectable({
  providedIn: 'root'
})
export class GameSetupService {
  private readonly isDevMode = inject(DEV_TOKEN)
  private readonly _REMOVEMESOON = inject(MapSelectionService)
  private readonly _userRepository = inject(UserRepository);
  private readonly _lobbyRepository = inject(LobbyRepository);

  private _game: Game | undefined;

  public loadGame() {
    if(this.isDevMode) {
      const users: LobbyUser[] = [generateRandomLobbyRobot(), {isRobot: false,...this._userRepository.getUser() ?? generateRandomLobbyRobot()}];
      const mapInformation = this._REMOVEMESOON.getMaps()[0];
      this.generateGame(mapInformation, users)
      this._game = this.generateGame(mapInformation, users)
    } else {
      const users = this._lobbyRepository.getUsers();
      const mapInformation = this._lobbyRepository.getMapData();
      if(!mapInformation) throw new Error(`No map information provided`);
      this._game = this.generateGame(mapInformation, users)
    }
    return this._game;
  }

  public getMap(): Playground | undefined {
    return this._game?.playground;
  }

  private generateGame(mapInformation: MapInformation, users: LobbyUser[]): Game {
      const playground = loadPlayground(mapInformation);
      const round = this.generateRound(usersToPlayers(users));
      const buildingGraph = playground.buildingGraph;
      const bankInventory = new ResourceInventory({
        straw: 50,
        stone: 50,
        wool: 50,
        bricks: 50,
        wood: 50
      })
      const buildCostManager = new BuildCostManager(bankInventory);
      this.mockBuildings(round.players, playground);
      const buildingFactory = new BuildingFactory();
      const diceRoller = new DiceRoller();
      const buildingBuildManager = new BuildingBuildManager(
        buildingGraph,
        playground.graph,
        buildCostManager,
        buildingFactory
      );
      const resourceDistributor = new ResourceDistributor(playground, buildingBuildManager, bankInventory);
      const game = new Game(
        {
          bank: bankInventory,
          buildingBuildManager,
          roadBuildManager: new RoadBuildManager(
            buildingGraph,
            buildCostManager,
          ),
          playground,
          round,
          buildCostManager,
          diceRoller,
          resourceDistributor,
          robberManager: new RobberManager(playground),
          tradeManager: new TradeManager(bankInventory, round)
        }
      );
  
      //TODO FIX ROBTEST
      // const field = game.playground.gridField.find((f) => (f.polygon.points.find((p) => game.playground.buildingGraph.getNodeByPoint(p))? f : false))
      // console.log("FIELD", field);
      // if(field) {
      //   game.robTest(round.players[0], field)
      // } 
  
      // setTimeout(() => {
      //   trade.cancelTrade("1")
      // }, 3000)
  
      
      return game;
    }

  //todo remove me later
  private  mockBuildings(players: Player[], playground: Playground) {
      const buildingFactory = new BuildingFactory();
  
      for(let i = 0; i < players.length * 2; i++) {
        try {
          const activePlayer = players[i % players.length];
          const randomLocation = playground.graph.nodes[parseInt("" + Math.random() * playground.graph.nodes.length)];
          playground.buildingGraph.tryAddNode(new GraphBuildingNode(randomLocation.id,randomLocation.position , activePlayer));
          const buildingNode = playground.buildingGraph.getNodeById(randomLocation.id);
          buildingNode?.tryBuild(buildingFactory.constructBuilding(BuildingType.TOWN, activePlayer, buildingNode));
          activePlayer.winningPointsInventory.setInventory({
            points: activePlayer.winningPointsAmount + 1,
          })
        } catch(e) {}
      }
      const loc = playground.graph.nodes[32]
      playground.buildingGraph.tryAddNode(new GraphBuildingNode("32",loc.position , players[1]));
      const buildingNode = playground.buildingGraph.getNodeById("32");
      buildingNode?.tryBuild(buildingFactory.constructBuilding(BuildingType.TOWN, players[1], buildingNode))
    }

  private generateRound(roundPlayers: RoundPlayer[]) {
    const players: Player[] = roundPlayers.map((p, i) => {
      return new Player(
        p,
        new ResourceInventory({
          wood: 10,
          bricks: 10,
          stone: 10,
          straw: 10,
          wool: 10
        }), 
        new WinningpointsInventory({
          points: 0
        }),
        new Graph()
      )
    });

    return new Round(players);
  }
}
