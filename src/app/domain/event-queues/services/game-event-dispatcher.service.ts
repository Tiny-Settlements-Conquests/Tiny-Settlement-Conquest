import { inject, Injectable } from '@angular/core';
import { dispatch } from '@ngneat/effects';
import { delay, merge } from 'rxjs';
import { DiceStore } from '../../dice/domain/state/dice.store';
import { Game } from '../../game/domain/classes/game';
import { resourcesToResourceCards, resourceTypeToResourceCard } from '../../resources/domain/function/resource-type.function';
import { RoundPlayer } from '../../round/domain/models/round-player.model';
import { RoundPlayerStore } from '../../round/domain/state/round-player.store';
import { UserRepository } from '../../user/domain/state/user.repository';
import { InventoryStore } from '../../inventory/domain/state/inventory.store';
import { GameModeStore } from '../../game/domain/state/game-mode.store';
import { BankStore } from '../../bank/domain/state/bank.store';
import { TradeStore } from '../../trade/domain/state/trade.store';
import { RoundCountdownStore } from '../../round/domain/state/countdown/round-countdown.store';
import { ActionHistoryStore } from '../../action-history/domain/state/action-history.store';

@Injectable({
  providedIn: 'any'
})
export class GameEventDispatcherService {
  private readonly _roundPlayerStore = inject(RoundPlayerStore);
  private readonly _userRepository = inject(UserRepository);
  private readonly _diceStore = inject(DiceStore);
  private readonly _inventoryStore = inject(InventoryStore);
  private readonly _gameModeStore = inject(GameModeStore);
  private readonly _bankStore = inject(BankStore);
  private readonly _tradeStore = inject(TradeStore);
  private readonly _roundCountdownStore = inject(RoundCountdownStore);
  private readonly _actionHistoryStore = inject(ActionHistoryStore)

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
        this._roundPlayerStore.setRoundPlayers(roundplayers);
      });
  }

  private syncPlayersWinningPoints(game: Game): void {
    game.selectPlayersWinningPoints().subscribe(({amount, player}) => {
      this._roundPlayerStore.setWinningPointsForPlayer(amount, player.id);
    })
  }

  private syncActiveRoundPlayer(game: Game): void {
    game.selectActiveRoundPlayer().subscribe((player) => {
      this._gameModeStore.setMode('spectate');
      this._roundPlayerStore.setActiveRoundPlayerById(player.id);
    })
  }


  private syncTradeOfferStarted(game: Game): void {
    const trade = game.getTradeManager();
      trade.selectTradeOfferStarted.subscribe((trade) => {
        this._tradeStore.addTrade(trade);
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
      this._tradeStore.removeTrade(data.tradeId);
    })

    trade.selectTradeCompleted.subscribe((data)=> {
      this._actionHistoryStore.addAction({
        typ: 'trade',
        id: Math.random().toString(),
        player: data.acceptedPlayer,
        playerB: data.trade.player,
        givenResources: resourcesToResourceCards(data.trade.requestedResources),
        receivedResources: resourcesToResourceCards(data.trade.offeredResources),
      })
    })
  }

  private syncOwnInventoryUpdate(game: Game): void {
    //todo das ist noch ungünstig gelöst
    const me = this._userRepository.getUser();
    if(!me) throw new Error('user has not been loaded');
    const player = game.round.getPlayerById(me.id);
    if(!player) throw new Error('player has not been found');
    this._inventoryStore.setResources(player.resourceInventory.resources)

    game.selectUserInventoryUpdate().pipe(
    ).subscribe(({newAmount, type}) => {
      this._inventoryStore.updateResourceAmount(type, newAmount);
    })
  }

  private syncInventoryHistoryUpdate(game: Game): void {
    game.selectUserInventoryUpdate().pipe(
    ).subscribe((inventory) => {
      console.log("inventory update", inventory) // todo old & new amount hier rauslassen -> could be abused
      if(inventory.oldAmount < inventory.newAmount) { // old amount darf nicht größer als der neue sein, sonst wurde etwas abgezogen
        this._actionHistoryStore.addAction({
            typ: 'resource',
            id: Math.random().toString(),
            player: inventory.player.roundPlayer,
            receivedResources: [resourceTypeToResourceCard(inventory.type)],
          })
      }
    })
  }

  private syncTimer(game: Game): void {
    game.selectCurrentTimer().subscribe((countdown) => {
      this._roundCountdownStore.startCountdown(countdown)
    })
  }

  private syncBuildingUpdates(game: Game): void {
    game.selectBuildingUpdate().subscribe((data) => {
      this._actionHistoryStore.addAction({
        typ: 'build',
        id: Math.random().toString(),
        player: data.owner.roundPlayer,
        building: data.type,
      })
    })
  }

  private syncBankInventory(game: Game): void {
    game.selectBankInventoryUpdate().subscribe(inventory => {
      this._bankStore.updateResourceAmount(inventory.type, inventory.amount)
    });
  }

  private syncDiceOverlayOpenState(game: Game): void {
    game.selectRound().pipe(
    ).subscribe((d) => {
      this._diceStore.setDices(undefined);
      this._diceStore.setIsOverlayOpen(false);
      //todo build this with userRepo
      console.log("RESET CAUSE NEW ROUND!")
      if(this._roundPlayerStore.me() !== undefined && d.activePlayer?.roundPlayer.id === this._roundPlayerStore.me()?.id && !d.activePlayer.roundPlayer.isBot) {
        this._diceStore.setIsOverlayOpen(true);
        console.log("OPEN !")
      }
    })
  }

  private syncDices(game: Game): void {
    game.selectRolledDice().pipe(
    ).subscribe(({dices, player}) => {
      if(!player) return;
      this._actionHistoryStore.addAction({
        typ: 'dice',
        id: Math.random().toString(),
        player: player.roundPlayer,
        dice: dices
      })
      console.log("SETD")
      this._diceStore.setDices(dices);
    })
  }
}
