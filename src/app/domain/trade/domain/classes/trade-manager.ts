import { Observable, Subject, filter, race, takeUntil, timer } from 'rxjs';
import { ResourceInventory,  } from '../../../inventory/domain/classes/resource-inventory';
import { Player } from '../../../player/domain/classes/player';
import { Round } from '../../../round/domain/classes/round';
import { OpenTradeOffer, TradeCancel, TradeComplete, TradeOffer, TradeResponse } from '../models/trade.model';
import { Resources } from '../../../resources/domain/models/resources.model';
import { RoundPlayer } from '../../../round/domain/models/round-player.model';



export class TradeManager {
  private tradeOffers: TradeOffer[] = [];
  private tradeOfferCount = 0;
  private maxTradeOffersPerRound = 3;

  private tradeOfferStarted = new Subject<TradeOffer>();
  private tradeResponses = new Subject<TradeResponse>();
  private tradeCompleted = new Subject<TradeComplete>();
  private tradeCancel = new Subject<TradeCancel>();
  private openTrades: { [key: string]: OpenTradeOffer } = {}


  //todo make timeout interval when created trade configurable via constructor
  constructor(
    private bank: ResourceInventory, 
    private round: Round
  ) {}

  public get selectTradeOfferStarted(): Observable<TradeOffer> {
    return this.tradeOfferStarted.asObservable();
  }

  /**
   * Emits a `TradeComplete` when a trade is completed.
   */
  public get selectTradeCompleted(): Observable<TradeComplete> {
    return this.tradeCompleted.asObservable();
  }

  /**
   * Emits a `TradeCancel` event whenever a trade is canceled.
   */
  public get selectTradeCancel(): Observable<TradeCancel> {
    return this.tradeCancel.asObservable();
  }
  
  /**
   * emits if a player accepts or denies a trade
   */
  public get selectTradeResponse(): Observable<TradeResponse> {
    return this.tradeResponses.asObservable();
  }

  public startTrade(offer: TradeOffer): void {
    console.log("TRADE OPENED", offer)
    this.tradeOfferStarted.next(offer);
    if(offer.typ === 'player') {
      this.startTradeTimer(offer);
      this.openTrades[offer.id] = {
        ...offer,
        playerResponses: {}
      }
    } else {
      console.error("to be implemented")
      //is bank trade to be implemented
    }
  }

  private startTradeTimer(offer: TradeOffer, duration: number = 10_000) {
    race([
      timer(duration).pipe(
        takeUntil(
          this.tradeCompleted.pipe(
            filter(({trade}) => trade.id === offer.id)
          )
        ),
        takeUntil(
          this.tradeCancel.pipe(
            filter(({tradeId}) => tradeId === offer.id)
          )
        )
      )
    ]).subscribe(() => {
      this.cancelTrade(offer.id)
    })
  }

  public cancelTrade(tradeId: string): void {
    this.tradeCancel.next({ tradeId });
    delete this.openTrades[tradeId];
  }

  public respondToTrade(response: TradeResponse): void {
    const {tradeId, respondedPlayer, accepted} = response;
    this.tradeResponses.next({tradeId, respondedPlayer, accepted });
    const openTrade = this.getOpenTrade(tradeId);
    openTrade.playerResponses[respondedPlayer.id] = {
      accepted,
      respondedPlayer,
      tradeId
    };
    this.checkTradeStatus(response)
  }

  private getOpenTrade(tradeId: string) {
    console.log(this.openTrades);
    console.log(tradeId);
    const openTrade = this.openTrades[tradeId]
    if(!openTrade) throw new Error("Trade not found");
    return openTrade
  }

  private checkTradeStatus(response: TradeResponse) {
    const openTrade = this.getOpenTrade(response.tradeId);
    // has enought responses
    if(Object.keys(openTrade.playerResponses).length < this.round.players.length - 1) return;
    // one player has accepted
    const hasOnePlayerAccepted = Object.values(openTrade.playerResponses).find(({accepted}) => accepted === true)
    if(hasOnePlayerAccepted) {
      this.completeTrade(openTrade, response.respondedPlayer)
    } else {
      // no player accepted cancel trade
      this.cancelTrade(response.tradeId)
    }
  }

  private completeTrade(offer: OpenTradeOffer, acceptedRoundPlayer: RoundPlayer): void {
    const offerPlayer = this.round.getPlayerById(offer.player.id);
    const acceptedPlayer = this.round.getPlayerById(acceptedRoundPlayer.id);
    if(!offerPlayer || !acceptedPlayer) throw new Error('offerPlayer or Accepted Player is null')
    if(!offerPlayer.resourceInventory.hasEnoughtResources(offer.offeredResources)) throw new Error('1cnot enought resources')
    if(!acceptedPlayer.resourceInventory.hasEnoughtResources(offer.requestedResources)) throw new Error('not enought resources')

    Object.entries(offer.requestedResources).forEach(([key, value]) => {
      acceptedPlayer.resourceInventory.removeFromInventory(key as keyof Resources, value);
      offerPlayer.resourceInventory.addToInventory(key as keyof Resources, value);

    })
    Object.entries(offer.offeredResources).forEach(([key, value]) => {
      offerPlayer.resourceInventory.removeFromInventory(key as keyof Resources, value);
      acceptedPlayer.resourceInventory.addToInventory(key as keyof Resources, value);
    })

    this.tradeCompleted.next({
      acceptedPlayer: acceptedRoundPlayer,
      trade: offer
    });
  }

}