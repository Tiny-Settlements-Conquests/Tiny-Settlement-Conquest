import { Injectable } from '@angular/core';
import { Game } from '../../game/domain/classes/game';
import { dispatch } from '@ngneat/effects';
import { RoundPlayerActions } from '../../round/domain/state/round-player.actions';
import { RoundPlayer } from '../../round/domain/models/round-player.model';
import { TradeActions } from '../../trade/domain/state/trade.actions';
import { delay, merge } from 'rxjs';
import { ActionHistoryActions } from '../../action-history/domain/state/action-history.actions';
import { resourcesToResourceCards } from '../../resources/domain/function/resource-type.function';

@Injectable({
  providedIn: 'any'
})
export class GameEventDispatcherService {

  //game soll später ein interface sein, dass sowohl das game als auch ein websocket client sein kann
  public sync(game: Game): void {
    console.log("GAME", game)
    this.syncRoundPlayers(game);
    this.syncPlayersWinningPoints(game);
    this.syncActiveRoundPlayer(game);
    this.syncTradeResponses(game);
    this.syncTradeOfferStarted(game);
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
}
