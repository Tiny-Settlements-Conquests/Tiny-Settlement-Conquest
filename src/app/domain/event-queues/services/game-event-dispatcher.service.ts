import { inject, Injectable } from '@angular/core';
import { dispatch } from '@ngneat/effects';
import { delay, merge } from 'rxjs';
import { ActionHistoryActions } from '../../action-history/domain/state/action-history.actions';
import { BankActions } from '../../bank/domain/state/bank.actions';
import { DiceActions } from '../../dice/domain/state/dice.actions';
import { Game } from '../../game/domain/classes/game';
import { GameModeActions } from '../../game/domain/state/game-mode.actions';
import { InventoryActions } from '../../inventory/domain/state/inventory.actions';
import { resourcesToResourceCards, resourceTypeToResourceCard } from '../../resources/domain/function/resource-type.function';
import { RoundPlayer } from '../../round/domain/models/round-player.model';
import { RoundCountdownActions } from '../../round/domain/state/countdown/round-countdown.actions';
import { RoundPlayerActions } from '../../round/domain/state/round-player.actions';
import { RoundPlayerRepository } from '../../round/domain/state/round-players.repository';
import { TradeActions } from '../../trade/domain/state/trade.actions';
import { UserRepository } from '../../user/domain/state/user.repository';

@Injectable({
  providedIn: 'any'
})
export class GameEventDispatcherService {
  private readonly _roundPlayerRepository = inject(RoundPlayerRepository);
  private readonly _userRepository = inject(UserRepository);

  //todo define an interface instead
    //todo jeweils als injection token of type gameState und dann gibts den service einmal mit game als quelle
    // und einmal mit einem websocket, das ist aber diesem service hier egal, hauptsache es kommen daten an
  public sync(game: Game): void {
    console.log("GAME", game)
    this.syncRoundPlayers(game);
    // this.syncPlayersWinningPoints(game);
    this.syncActiveRoundPlayer(game);
    // this.syncTradeResponses(game);
    // this.syncTradeOfferStarted(game);
    // this.syncOwnInventoryUpdate(game);
    // this.syncInventoryHistoryUpdate(game);
    this.syncTimer(game);
    // this.syncBuildingUpdates(game);
    // this.syncBankInventory(game);
    this.syncDices(game);
    this.syncDiceOverlayOpenState(game);
  }

  private syncRoundPlayers(game: Game): void {
    game.selectPlayers().subscribe(roundPlayers => {
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
        }));
        dispatch(
          RoundPlayerActions.setRoundPlayers({players: roundplayers})
        )
      });
  }

  private syncPlayersWinningPoints(game: Game): void {
    game.selectPlayersWinningPoints().subscribe(({amount, player}) => {
      dispatch(
        RoundPlayerActions.setWinningPointsForPlayer({amount, playerId: player.id})
      )
    })
  }

  private syncActiveRoundPlayer(game: Game): void {
    game.selectActiveRoundPlayer().subscribe((player) => {
      dispatch(
        GameModeActions.updateMode({mode: 'spectate'}),
        RoundPlayerActions.updateActiveRoundPlayer({playerId: player.id})
      )
    })
  }


  private syncTradeOfferStarted(game: Game): void {
    const trade = game.getTradeManager();
      trade.selectTradeOfferStarted.subscribe((trade) => {
        dispatch(
          TradeActions.addTrade(trade)
        )
    })
  }

  private syncTradeResponses(game: Game): void {
    const trade = game.getTradeManager();
    const tradeEvent = merge(
      trade.selectTradeCompleted,
      trade.selectTradeCancel
    )
    tradeEvent.pipe(
      delay(2000)
    ).subscribe((data) =>{
      dispatch(
        TradeActions.removeTrade({id: data.tradeId})
      )
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

  private syncOwnInventoryUpdate(game: Game): void {
    //todo das ist noch ungünstig gelöst
    const me = this._userRepository.getUser();
    if(!me) throw new Error('user has not been loaded');
    const player = game.round.getPlayerById(me.id);
    if(!player) throw new Error('player has not been found');
    dispatch(
      InventoryActions.setResources({resources:player.resourceInventory.resources})
    )

    game.selectUserInventoryUpdate().pipe(
    ).subscribe(({newAmount, type}) => {
      dispatch(InventoryActions.updateResourceAmount({resourceType: type, amount: newAmount}));
    })
  }

  private syncInventoryHistoryUpdate(game: Game): void {
    game.selectUserInventoryUpdate().pipe(
    ).subscribe((inventory) => {
      console.log("inventory update", inventory) // todo old & new amount hier rauslassen -> could be abused
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

  private syncTimer(game: Game): void {
    game.selectCurrentTimer().subscribe((data) => {
      dispatch(RoundCountdownActions.setRoundCountdown({
        countdown: data,
      }))
    })
  }

  private syncBuildingUpdates(game: Game): void {
    game.selectBuildingUpdate().subscribe((data) => {
      dispatch(
        ActionHistoryActions.addAction({
          typ: 'build',
          id: Math.random().toString(),
          player: data.owner.roundPlayer,
          building: data.type,
        })
      )
    })
  }

  private syncBankInventory(game: Game): void {
    game.selectBankInventoryUpdate().subscribe(inventory => {
      dispatch(
        BankActions.updateResourceAmount({
          resourceType: inventory.type,
          amount: inventory.amount
        })
      )
    });
  }

  private syncDiceOverlayOpenState(game: Game): void {
    game.selectRound().pipe(
    ).subscribe((d) => {
      dispatch(
        DiceActions.resetDices()
      );
      //todo build this with userRepo
      if(this._roundPlayerRepository.getMe() !== undefined && d.activePlayer?.roundPlayer.id === this._roundPlayerRepository.getMe()?.id && !d.activePlayer.roundPlayer.isBot) {
        dispatch(
          DiceActions.updateDiceOverlayOpenState({isOpen: true})
        )
      }
    })
  }

  private syncDices(game: Game): void {
    game.selectRolledDice().pipe(
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
      console.log("SETD")
      dispatch(
        DiceActions.setDices({dices})
      )
    })
  }
}
