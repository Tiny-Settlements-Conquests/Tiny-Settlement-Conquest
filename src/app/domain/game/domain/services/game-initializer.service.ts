import { inject, Injectable } from '@angular/core';
import { DEV_TOKEN, EDITION_TOKEN, Edition, LobbyStore, UserStore } from '@catan/core';
import { EventGateway, LobbyUser, MapInformation } from '@catan/shared/models';
import {
  Game, Player, Round, ResourceInventory, WinningpointsInventory,
  Graph, BuildCostManager, BuildingBuildManager, RoadBuildManager,
  BuildingFactory, DiceRoller, ResourceDistributor, RobberManager,
  TradeManager, loadPlayground, usersToPlayers,
} from '@catan/game-engine';
import { LocalEventGateway } from '../../../event-gateway/local-event.gateway';
import { MapSelectionService } from '../../../map-selection/domain/services/map-selection.service';
import { generateRandomLobbyRobot } from '../../../lobby/domain/utils/lobby.utils';

/**
 * GameInitializerService — Creates and configures a new Game instance.
 *
 * Replaces the old GameSetupService. Key improvements:
 * - Returns the created Game and EventGateway via initializeGame()
 * - Creates the appropriate EventGateway based on edition
 * - Clean separation: initialization logic only, no rendering or sync
 * - Caches the result so multiple consumers can access game/gateway after initialization
 */
@Injectable()
export class GameInitializerService {
  private readonly isDev = inject(DEV_TOKEN);
  private readonly edition = inject(EDITION_TOKEN);
  private readonly userStore = inject(UserStore);
  private readonly lobbyStore = inject(LobbyStore);
  private readonly mapService = inject(MapSelectionService);

  private _game?: Game;
  private _gateway?: EventGateway;

  get game(): Game | undefined { return this._game; }
  get gateway(): EventGateway | undefined { return this._gateway; }

  initializeGame(): { game: Game; gateway: EventGateway } {
    if (this._game && this._gateway) {
      return { game: this._game, gateway: this._gateway };
    }

    let users: LobbyUser[] = this.lobbyStore.getUsers();
    let mapInfo = this.lobbyStore.getMapData();

    if (!mapInfo && this.isDev) {
      users = [
        generateRandomLobbyRobot(),
        { isRobot: false, ...this.userStore.getUser() ?? generateRandomLobbyRobot() },
      ];
      mapInfo = this.mapService.getMaps()[0];
    }

    if (!mapInfo) {
      throw new Error('Cannot start game: No map information provided');
    }

    const game = this.createGame(mapInfo, users);
    const gateway = this.createGateway(game);

    this._game = game;
    this._gateway = gateway;

    return { game, gateway };
  }

  private createGame(mapInfo: MapInformation, users: LobbyUser[]): Game {
    const playground = loadPlayground(mapInfo);
    const roundPlayers = usersToPlayers(users);
    const players = roundPlayers.map(p =>
      new Player(
        p,
        new ResourceInventory({ wood: 10, bricks: 10, stone: 10, straw: 10, wool: 10 }),
        new WinningpointsInventory({ points: 0 }),
        new Graph()
      )
    );
    const round = new Round(players);
    const bankInventory = new ResourceInventory({
      straw: 50, stone: 50, wool: 50, bricks: 50, wood: 50,
    });
    const buildCostManager = new BuildCostManager(bankInventory);
    const buildingFactory = new BuildingFactory();
    const buildingBuildManager = new BuildingBuildManager(
      playground.buildingGraph, playground.graph, buildCostManager, buildingFactory
    );

    return new Game({
      bank: bankInventory,
      buildingBuildManager,
      roadBuildManager: new RoadBuildManager(playground.buildingGraph, buildCostManager),
      playground,
      round,
      buildCostManager,
      diceRoller: new DiceRoller(),
      resourceDistributor: new ResourceDistributor(playground, buildingBuildManager, bankInventory),
      robberManager: new RobberManager(playground),
      tradeManager: new TradeManager(bankInventory, round),
    });
  }

  private createGateway(game: Game): EventGateway {
    if (this.edition === Edition.MULTIPLAYER) {
      console.warn('Multiplayer mode not yet implemented — using local gateway');
    }
    return new LocalEventGateway(game);
  }
}
