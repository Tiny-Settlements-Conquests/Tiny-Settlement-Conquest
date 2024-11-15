import { Observable, Subject, filter, race, takeUntil, timer } from 'rxjs';
import { ResourceInventory, } from '../../../inventory/domain/classes/resource-inventory';
import { Resources } from '../../../resources/domain/models/resources.model';
import { Round } from '../../../round/domain/classes/round';
import { RoundPlayer } from '../../../round/domain/models/round-player.model';
import { PlayerTrade, TradeCancel, TradeComplete, TradeOffer, TradeRequest, TradeResponse, TradeState, TradeType } from '../models/trade.model';
import { checkIsAValidBankTrade } from '../utils/bank.utils';
import { isAValidTrade } from '../utils/trade.utils';



export class TradeManager {
  private tradeOffers: TradeOffer[] = [];
  private tradeOfferCount = 0;
  private maxTradeOffersPerRound = 3;

  private tradeOfferStarted = new Subject<PlayerTrade>();
  private tradeResponses = new Subject<TradeResponse>();
  private tradeCompleted = new Subject<TradeComplete>();
  private tradeCancel = new Subject<TradeCancel>();
  private openPlayerTrades: { [key: string]: PlayerTrade } = {}


  //todo make timeout interval when created trade configurable via constructor
  //todo split this manager into bank and player trade manager
  constructor(
    private bank: ResourceInventory, 
    private round: Round
  ) {}

  public get selectTradeOfferStarted(): Observable<PlayerTrade> {
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

  public startTrade(request: TradeRequest): void {
    const offer: TradeOffer = {
      ...request,
      playerResponses: {},
      id: Math.random().toString()
    }
    if(offer.typ === TradeType.Player) {
      this.tradeOfferStarted.next(offer);
      this.startTradeTimer(offer);
      this.openPlayerTrades[offer.id] = {
        ...offer,
        playerResponses: {}
      }
    } else {
      this.bankTrade(offer);
    }
  }

  private bankTrade(offer: TradeOffer): void {
    const offeredResources = offer.offeredResources;
    const requestedResources = offer.requestedResources;
    if(!isAValidTrade(offeredResources, requestedResources)) throw new Error('invalid trade');
    if(!checkIsAValidBankTrade(offeredResources, requestedResources)) throw new Error('invalid bank trade');
    const playerInv = this.round.getPlayerById(offer.player.id)?.resourceInventory;
    if(!playerInv) throw new Error('player not found');
    this.transferResources({
      offeredResources,
      requestedResources,
      fromInventory: playerInv,
      toInventory: this.bank
    })
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
    this.tradeCancel.next({ tradeId, state: TradeState.Declined });
    delete this.openPlayerTrades[tradeId];
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
    const openTrade = this.openPlayerTrades[tradeId]
    if(!openTrade) throw new Error("Trade not found");
    return openTrade
  }

  private checkTradeStatus(response: TradeResponse) {
    const openTrade = this.getOpenTrade(response.tradeId);
    //check if the trade is accepted
    const hasOnePlayerAccepted = Object.values(openTrade.playerResponses).find(({accepted}) => accepted === true)
    if(hasOnePlayerAccepted) {
      this.completeTrade(openTrade, response.respondedPlayer);
      return;
    } else if(!(Object.keys(openTrade.playerResponses).length < this.round.players.length - 1)) {
      this.cancelTrade(response.tradeId)
      // no player accepted cancel trade
    }
  }

  private completeTrade(offer: TradeOffer, acceptedRoundPlayer: RoundPlayer): void {
    const offerPlayer = this.round.getPlayerById(offer.player.id);
    const acceptedPlayer = this.round.getPlayerById(acceptedRoundPlayer.id);
    if(!offerPlayer || !acceptedPlayer) throw new Error('offerPlayer or Accepted Player is null')
    this.transferResources({
      fromInventory: offerPlayer.resourceInventory,
      toInventory: acceptedPlayer.resourceInventory,
      offeredResources: offer.offeredResources,
      requestedResources: offer.requestedResources
  })

    this.tradeCompleted.next({
      acceptedPlayer: acceptedRoundPlayer,
      trade: offer,
      tradeId: offer.id,
      state: TradeState.Accepted
    });
  }

  private transferResources(opts: {
    fromInventory: ResourceInventory, 
    toInventory: ResourceInventory, 
    offeredResources: Partial<Resources>, 
    requestedResources: Partial<Resources>}
  ) {
    const {fromInventory, toInventory, offeredResources, requestedResources} = opts
    if(!fromInventory.hasEnoughtResources(offeredResources)) throw new Error('1cnot enought resources')
    if(!fromInventory.hasEnoughtResources(requestedResources)) throw new Error('not enought resources')

    Object.entries(requestedResources).forEach(([key, value]) => {
      toInventory.removeFromInventory(key as keyof Resources, value);
      fromInventory.addToInventory(key as keyof Resources, value);

    })
    Object.entries(offeredResources).forEach(([key, value]) => {
      fromInventory.removeFromInventory(key as keyof Resources, value);
      toInventory.addToInventory(key as keyof Resources, value);
    })
  }

  public cancelAllTrades() {
    Object.values(this.openPlayerTrades).forEach((value) => {
      this.cancelTrade(value.id)
    })
  }

}