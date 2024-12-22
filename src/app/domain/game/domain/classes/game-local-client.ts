import { ComponentRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { dispatch } from '@ngneat/effects';
import { Subject, delay, filter, map, merge, switchMap, take, takeUntil } from "rxjs";
import { ActionHistoryActions } from "../../../action-history/domain/state/action-history.actions";
import { MediumBot } from "../../../bot/domain/classes/medium-bot";
import { DiceOverlayComponent } from "../../../dice/ui/dice-overlay/dice-overlay.component";
import { resourceTypeToResourceCard, resourcesToResourceCards } from "../../../resources/domain/function/resource-type.function";
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
    //!!remove me later

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
    // this.syncTrades();
    this.syncStates();
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

  private syncStates() {

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
      this._gameModeRepository.updateMode('spectate');//todo as action!!!!!!!!!!!
      if(player) {
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
