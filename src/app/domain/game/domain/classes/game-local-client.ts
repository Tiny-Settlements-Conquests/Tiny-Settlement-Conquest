import { ComponentRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { dispatch } from '@ngneat/effects';
import { Subject, delay, filter, map, merge, switchMap, take, takeUntil } from "rxjs";
import { ActionHistoryActions } from "../../../action-history/domain/state/action-history.actions";
import { MediumBot } from "../../../bot/domain/classes/medium-bot";
import { DiceOverlayComponent } from "../../../dice/ui/dice-overlay/dice-overlay.component";
import { resourceTypeToResourceCard, resourcesToResourceCards } from "../../../resources/domain/function/resource-type.function";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";
import { RoundCountdownActions } from "../../../round/domain/state/countdown/round-countdown.actions";
import { TradeActions } from "../../../trade/domain/state/trade.actions";
import { GameClientDependencies } from "../models/game-client.model";
import { Game } from "./game";
import { GameClient } from "./game-client.abstract";

export class GameLocalClient extends GameClient {
  public get game() {
    return this._game;
  }

  private _diceRef: undefined | ComponentRef<DiceOverlayComponent> = undefined;
  private _diceOverlayOpen = new Subject();

  //todo define an interface instead
  constructor(deps: GameClientDependencies, private readonly _game: Game) {
    super(deps)
    //todo das später noch besser machen mit event streams
    this._eventQueueRepository.selectLatestResponse().subscribe((t) => {
      if(t && t.type == 'trade-offer-open') {
        this.game.getTradeManager().startTrade(t.data);
      } else if(t?.type === 'trade-offer-accept') {
        this.game.getTradeManager().respondToTrade(t.data)
      } else if(t?.type === 'trade-offer-deny') {
        this.game.getTradeManager().respondToTrade(t.data)
      } else if(t?.type === 'buildBuilding') {
        this.game.tryBuildBuildingOnGraphNode(t.data);
      } else if(t?.type === 'buildRoad') {
        this.game.tryBuildRoadBetweenGraphNodes(t.data.from, t.data.to);
      } else if(t?.type === 'nextRound') {
        this.game.nextRound();
      }
    })
    
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
    // dispatch(
    //   TradeActions.addTrade({
    //     id: '2352',
    //     offeredResources: {
    //       bricks: 6
    //     },
    //     playerResponses: {},
    //     player: this._roundPlayerRepository.getRoundPlayers()[0],
    //     requestedResources: {
    //       wood: 1
    //     },
    //     typ: TradeType.Player
    //   }),
    //   TradeActions.addTrade({
    //     id: '5342',
    //     offeredResources: {
    //       bricks: 2
    //     },
    //     playerResponses: {},
    //     player: this._roundPlayerRepository.getRoundPlayers()[1],
    //     requestedResources: {
    //       wood: 1
    //     },
    //     typ: TradeType.Player
    //   })
    // )
    this.game.selectPlayersWinningPoints().subscribe(({amount, player}) => {
      this._roundPlayerRepository.setWinningPointsForPlayer(amount, player.id);
    })

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
    // this.syncDices();
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

  private openDiceOverlay() {
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

    diceRef.instance.dices = dices;
    diceRef.instance.rollDices()
    diceRef.instance.result.pipe(
      take(1),
      delay(1000)
    ).subscribe(() => diceRef.destroy())
  }
}
