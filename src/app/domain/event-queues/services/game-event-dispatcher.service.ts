import { Injectable } from '@angular/core';
import { Game } from '../../game/domain/classes/game';
import { dispatch } from '@ngneat/effects';
import { RoundPlayerActions } from '../../round/domain/state/round-player.actions';
import { RoundPlayer } from '../../round/domain/models/round-player.model';
import { TradeActions } from '../../trade/domain/state/trade.actions';
import { delay, merge } from 'rxjs';
import { ActionHistoryActions } from '../../action-history/domain/state/action-history.actions';
import { resourcesToResourceCards, resourceTypeToResourceCard } from '../../resources/domain/function/resource-type.function';
import { RoundCountdownActions } from '../../round/domain/state/countdown/round-countdown.actions';
import { BankActions } from '../../bank/domain/state/bank.actions';

@Injectable({
  providedIn: 'any'
})
export class GameEventDispatcherService {

  //todo in den client implementieren 
  //game soll später ein interface sein, dass sowohl das game als auch ein websocket client sein kann
  public sync(game: Game): void {
    console.log("GAME", game)
    this.syncRoundPlayers(game);
    this.syncPlayersWinningPoints(game);
    this.syncActiveRoundPlayer(game);
    this.syncTradeResponses(game);
    this.syncTradeOfferStarted(game);
    this.syncInventoryUpdate(game);
    this.syncTimer(game);
    this.syncBuildingUpdates(game);
    this.syncBankInventory(game);
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

  private syncInventoryUpdate(game: Game): void {
    game.selectUserInventoryUpdate().pipe(
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
}
