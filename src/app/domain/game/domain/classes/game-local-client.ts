import { ComponentRef, DestroyRef, ViewContainerRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { dispatch } from '@ngneat/effects';
import { Subject, delay, filter, map, merge, switchMap, take, takeUntil } from "rxjs";
import { ActionHistoryActions } from "../../../action-history/domain/state/action-history.actions";
import { ActionHistoryRepository } from "../../../action-history/domain/state/action-history.repository";
import { BankRepository } from "../../../bank/domain/state/bank.repository";
import { MediumBot } from "../../../bot/domain/classes/medium-bot";
import { BuildCostManager } from "../../../buildings/domain/classes/build-cost-manager";
import { BuildingBuildManager } from "../../../buildings/domain/classes/building-build-manager";
import { RoadBuildManager } from "../../../buildings/domain/classes/road-build-manager";
import { BuildingFactory } from "../../../buildings/domain/factories/building.factory";
import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { BuildingType } from "../../../buildings/domain/models/building.model";
import { DiceRoller } from "../../../dice/domain/classes/dice-roller";
import { DiceRepository } from "../../../dice/domain/state/dice.repository";
import { DiceOverlayComponent } from "../../../dice/ui/dice-overlay/dice-overlay.component";
import { Graph } from "../../../graph/domain/classes/graph";
import { ResourceInventory } from "../../../inventory/domain/classes/resource-inventory";
import { WinningpointsInventory } from "../../../inventory/domain/classes/winningpoints-inventory";
import { InventoryRepository } from "../../../inventory/domain/state/inventory.repository";
import { LobbyUser } from "../../../lobby/domain/models/lobby.model";
import { MapInformation } from "../../../map-selection/domain/models/map-selection.model";
import { Player } from "../../../player/domain/classes/player";
import { Playground } from "../../../playground/domain/classes/playground";
import { ResourceDistributor } from "../../../resources/domain/classes/resources/resource-distributor";
import { resourceTypeToResourceCard, resourcesToResourceCards } from "../../../resources/domain/function/resource-type.function";
import { ResponseQueueRepository } from "../../../response-queue/domain/state/response-queue.repository";
import { RobberManager } from "../../../robber/domain/classes/robber-manager";
import { Round } from "../../../round/domain/classes/round";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";
import { RoundCountdownActions } from "../../../round/domain/state/countdown/round-countdown.actions";
import { RoundPlayerRepository } from "../../../round/domain/state/round-players.repository";
import { usersToPlayers } from "../../../round/domain/utils/user-to-player.utils";
import { TradeManager } from "../../../trade/domain/classes/trade-manager";
import { TradeActions } from "../../../trade/domain/state/trade.actions";
import { TradeRepository } from "../../../trade/domain/state/trade.repository";
import { UserRepository } from "../../../user/domain/state/user.repository";
import { GameModeRepository } from "../state/game-mode.repository";
import { loadPlayground } from "../utils/game-loader.utils";
import { Game } from "./game";
import { TradeType } from "../../../trade/domain/models/trade.model";

export class GameLocalClient {
  private _game: Game

  public get game() {
    return this._game;
  }

  private _diceRef: undefined | ComponentRef<DiceOverlayComponent> = undefined;
  private _diceOverlayOpen = new Subject();

  //todo define an interface instead
  constructor(
    private readonly _users: LobbyUser[],
    private _mapInformation: MapInformation,
    private _gameComponentRef: ViewContainerRef,
    private _bankRepository: BankRepository,
    private _inventoryRepository: InventoryRepository,
    private _roundPlayerRepository: RoundPlayerRepository,
    private _userRepository: UserRepository,
    private _gameModeRepository: GameModeRepository,
    private _diceRepository: DiceRepository,
    private _actionHistoryRepository: ActionHistoryRepository,
    private _tradeRepository: TradeRepository,
    private _responseQueueRepository: ResponseQueueRepository,
    private _destroyRef: DestroyRef,
  ) { 
    //TODO umbenennen in event Queue
    this._responseQueueRepository.selectLatestResponse().subscribe((t) => {
      if(t && t.type == 'trade-offer-open') {
        this.game.getTradeManager().startTrade(t.data);
      } else if(t?.type === 'trade-offer-accept') {
        this.game.getTradeManager().respondToTrade(t.data)
      } else if(t?.type === 'trade-offer-deny') {
        this.game.getTradeManager().respondToTrade(t.data)
      }
    })
    
    this._game = this.generateGame();
//!!remove me later
this._game.selectPlayers().subscribe(roundPlayers => {
  //todo build a mapper
  const roundplayers = roundPlayers.map((p): RoundPlayer => ({
    color: p.color,
    id: p.id,
    isBot: p.roundPlayer.isBot,
    name: p.name,
    profileUrl: p.profileUrl,
    researchCardCount: p.researchCardCount,
    winningPoints: p.winningPointsAmount,
    resourceCardCount: p.resourceCardCount
  }))
  this._roundPlayerRepository.setRoundPlayers(roundplayers);
});
//this is locally only 
dispatch(
  TradeActions.addTrade({
    id: '2352',
    offeredResources: {
      bricks: 6
    },
    playerResponses: {},
    player: this._roundPlayerRepository.getRoundPlayers()[0],
    requestedResources: {
      wood: 1
    },
    typ: TradeType.Player
  }),
  TradeActions.addTrade({
    id: '5342',
    offeredResources: {
      bricks: 2
    },
    playerResponses: {},
    player: this._roundPlayerRepository.getRoundPlayers()[1],
    requestedResources: {
      wood: 1
    },
    typ: TradeType.Player
  })
)
this._tradeRepository.selectAllTrades().subscribe(trades => {
  //todo fix me later 
  // const player = this.game.round.players.find((p) => p.id === trades[0].player.id)
  // if(!player) return;
  // this.game.tradeTest().startTrade({
  //   ...trades[0],
  //   player,
  // })
})
//!!
    this.syncTrades();
    this.syncStates();
    this.simulateGame();
    this.syncDices();
    this._userRepository.selectUser().pipe(
      map((me) => {
        if(me) {
          const player = this.game.round.getPlayerById(me.id)
          if(player) {
            this._inventoryRepository.setResources(player.resourceInventory.resources)
          }
        }
        return this.game?.round.players.find((u) => u.id === me?.id)
      }),
      switchMap((me) => {
        return this.game.selectUserInventoryUpdate().pipe(
          filter(({player}) => player.id === me?.id)
        );
      })
    ).subscribe(({newAmount, type}) => {
      this._inventoryRepository.updateResourceAmount(type, newAmount);
    })
  }

  private syncTrades() {
    const trade = this.game.getTradeManager();
    trade.selectTradeOfferStarted.subscribe((trade) => {
      dispatch(
        TradeActions.addTrade(trade)
      )
    })

    trade.selectTradeResponse.subscribe((data) => console.log("JAJAJAAJJAJA" , data))
    const tradeEvent = merge(
      trade.selectTradeCompleted,
      trade.selectTradeCancel
    )
    tradeEvent.pipe(
      delay(2000)
    ).subscribe((data) =>{
      this._tradeRepository.removeTrade(data.tradeId)
    })

    trade.selectTradeCompleted.subscribe((data)=> {
      dispatch(
        ActionHistoryActions.addAction({
          typ: 'trade',
          id: Math.random().toString(),
          player: data.acceptedPlayer,
          playerB: data.trade.player,
          givenResources: resourcesToResourceCards(data.trade.requestedResources),
          receivedResources: resourcesToResourceCards(data.trade.offeredResources),
        })
      )
    })
  }

  private syncDices() {
    this.game.selectRound().pipe(
    ).subscribe((d) => {
      this._diceRepository.resetDices();
      this._diceRef?.destroy();
      if(this._roundPlayerRepository.getMe() !== undefined && d.activePlayer?.roundPlayer.id === this._roundPlayerRepository.getMe()?.id && !d.activePlayer.roundPlayer.isBot) {
        this.openDiceOverlay()
      }
    })

    this.game.selectRolledDice().pipe(
    ).subscribe(({dices, player}) => {
      if(!player) return;
      dispatch(
        ActionHistoryActions.addAction({
          typ: 'dice',
          id: Math.random().toString(),
          player: player.roundPlayer,
          dice: dices
        })
      )
      this._diceRepository.setDices(dices);
      this.rollDice(dices);
    })
  }

  private syncRobber() {
    const robber = this.game.getRobberManager();
    // robber.playerRobsAtPosition
  }

  private simulateGame() {

    

    this.game.selectUserInventoryUpdate().pipe(
    ).subscribe((inventory) => {
      //todo replace by ngneat action
      if(inventory.oldAmount < inventory.newAmount) { // old amount darf nicht größer als der neue sein, sonst wurde etwas abgezogen
        dispatch(
          ActionHistoryActions.addAction({
            typ: 'resource',
            id: Math.random().toString(),
            player: inventory.player.roundPlayer,
            receivedResources: [resourceTypeToResourceCard(inventory.type)],
          })
        )
      }
    })
  }

  private syncStates() {
    this.game.selectCurrentTimer().subscribe((data) => {
      dispatch(RoundCountdownActions.setRoundCountdown({
        countdown: data,
      }))
    })

    this.game.selectBuildingUpdate().subscribe((data) => {
      dispatch(
        ActionHistoryActions.addAction({
          typ: 'build',
          id: Math.random().toString(),
          player: data.owner.roundPlayer,
          building: data.type,
        })
      )
    })

    this.game.selectBankInventoryUpdate().subscribe(inventory => {
      this._bankRepository.updateResourceAmount(inventory.type, inventory.amount);
    });

    this._userRepository.selectUser().pipe(
      map((me) => {
        if(me) {
          const player = this.game.round.getPlayerById(me.id)
          if(player) {
            this._inventoryRepository.setResources(player.resourceInventory.resources)
          }
        }
        return this.game?.round.players.find((u) => u.id === me?.id)
      }),
      switchMap((me) => {
        return this.game.selectUserInventoryUpdate().pipe(
          filter(({player}) => player.id === me?.id)
        );
      })
    ).subscribe(({newAmount, type}) => {
      this._inventoryRepository.updateResourceAmount(type, newAmount);
    })

    this.game.selectActiveRoundPlayer().subscribe((player) => {
      console.log("NEW ACTIVE PLAYER", player?.name)
      this._gameModeRepository.updateMode('spectate');
      if(player) {
        this._roundPlayerRepository.updateActiveRoundPlayer(player.id)
        if(player.isBot) {
          new MediumBot().makeMove(this.game, player)
        }
      }
    })

	this._gameModeRepository.selectMode().pipe(
		takeUntilDestroyed(this._destroyRef)
	).subscribe((mode) => {
		if(this.game === undefined) return;

		this.game.mode = mode;
	})
}

  private generateGame(): Game {
    const playground = loadPlayground(this._mapInformation);
    const round = this.generateRound(usersToPlayers(this._users));
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

  private generateRound(roundPlayers: RoundPlayer[]) {
    const players: Player[] = roundPlayers.map((p, i) => {
      return new Player(
        p,
        new ResourceInventory({
          wood: 10,
          bricks: 10,
          stone: 10,
          straw: 0,
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

  private mockBuildings(players: Player[], playground: Playground) {
    const buildingFactory = new BuildingFactory();

    for(let i = 0; i < players.length * 2; i++) {
      try {
        const activePlayer = players[i % players.length];
        const randomLocation = playground.graph.nodes[parseInt("" + Math.random() * playground.graph.nodes.length)];
        playground.buildingGraph.tryAddNode(new GraphBuildingNode(randomLocation.id,randomLocation.position , activePlayer));
        const buildingNode = playground.buildingGraph.getNodeById(randomLocation.id);
        buildingNode?.tryBuild(buildingFactory.constructBuilding(BuildingType.TOWN, activePlayer, buildingNode))
      } catch(e) {}
    }
    const loc = playground.graph.nodes[32]
    playground.buildingGraph.tryAddNode(new GraphBuildingNode("32",loc.position , players[1]));
    const buildingNode = playground.buildingGraph.getNodeById("32");
    buildingNode?.tryBuild(buildingFactory.constructBuilding(BuildingType.TOWN, players[1], buildingNode))
  }

  private openDiceOverlay() {
    console.log("open")
    this._diceOverlayOpen.next(true);
    
    const component = this._gameComponentRef.createComponent(DiceOverlayComponent);
    this._diceRef = component;
    component.instance.diceRollStart.pipe(
      take(1),
      takeUntil(this._diceOverlayOpen)
    ).subscribe(() => this.game.rollDice());
  }

  private rollDice(dices: [number, number]) {
    const diceRef = this._diceRef;
    if(!diceRef) return;

    console.log("ROLLDICE", dices);
    diceRef.instance.dices = dices;
    diceRef.instance.rollDices()
    diceRef.instance.result.pipe(
      take(1),
      delay(1000)
    ).subscribe(() => diceRef.destroy())
  }
}
