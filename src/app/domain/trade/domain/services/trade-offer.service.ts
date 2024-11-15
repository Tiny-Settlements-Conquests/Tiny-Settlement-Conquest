import { inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ResourceInventory } from '../../../inventory/domain/classes/resource-inventory';
import { combineLatest, filter, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { resourceTypeToActionCardMode, resourceTypeToResourceCard } from '../../../resources/domain/function/resource-type.function';
import { Resources, ResourceType } from '../../../resources/domain/models/resources.model';
import { InventoryRepository } from '../../../inventory/domain/state/inventory.repository';
import { dispatch } from '@ngneat/effects';
import { TradeActions } from '../state/trade.actions';
import { RoundPlayerRepository } from '../../../round/domain/state/round-players.repository';
import { checkIsAValidBankTrade } from '../utils/bank.utils';
import { isAValidTrade } from '../utils/trade.utils';
import { TradeType } from '../models/trade.model';
import { GATEWAY_TOKEN } from '../../../gateway/domain/token/gateway.token';

@Injectable({
  providedIn: 'any'
})
export class TradeOfferService {
  private readonly _fb = inject(FormBuilder)
  private readonly _inventoryRepository = inject(InventoryRepository);
  private readonly _playerRepository = inject(RoundPlayerRepository); 
  private readonly _eventQueue = inject(GATEWAY_TOKEN);

  public readonly offerForm = this._fb.group({
    isPlayerTrade: this._fb.control<boolean>(true),
    requestInventory: this._fb.control(new ResourceInventory()),
    offerInventory: this._fb.control(new ResourceInventory()),
    myInventory: this._fb.control(new ResourceInventory())
  })

  public readonly selectIsFormValid = this.offerForm.valueChanges.pipe(
    startWith(this.offerForm.value),
    filter((form): form is { 
      offerInventory: NonNullable<ResourceInventory>,
      requestInventory: NonNullable<ResourceInventory>,
      isPlayerTrade: boolean
    } => form.offerInventory !== null && form.offerInventory !== undefined && form.requestInventory !== null && form.requestInventory !== undefined),
    switchMap(({offerInventory, requestInventory, isPlayerTrade}) => {
      return combineLatest({
        offerInventory: offerInventory.selectInventory(),
        requestInventory: requestInventory.selectInventory(),
      }).pipe(
        map(() => {
          if(!requestInventory || requestInventory.amount === 0) return false;
          const offerInventoryResources = offerInventory.getNotEmptyResources();
          const requestInventoryResources = requestInventory.getNotEmptyResources()

          if(!isPlayerTrade) {
            if(!isAValidTrade(offerInventoryResources, requestInventoryResources)) return false;
            return checkIsAValidBankTrade(offerInventoryResources, requestInventoryResources)
          } 
          return isAValidTrade(offerInventoryResources, requestInventoryResources)
        })
      )
    })
  )

  public syncMyInventory() {
    this.offerForm.controls.myInventory.value?.setInventory(
      this._inventoryRepository.getResources()
    )
  }

  public selectIsPlayerTrade(): Observable<boolean> {
    return this.offerForm.valueChanges.pipe(
      startWith(this.offerForm.value),
      map((e) => e.isPlayerTrade ?? false)
    )
  }

  private readonly _myInventory$ = this.offerForm.controls.myInventory.valueChanges.pipe(
    startWith(this.offerForm.controls.myInventory.value),
    filter((e) => e !== null)
  )

  public selectMyInventoryResources = this._myInventory$.pipe(
    switchMap((inv) => {
      return inv.selectInventory().pipe(
        map((inv) => Object.entries(inv).map(([type, amount]) => ({ 
          mode: resourceTypeToActionCardMode(type as ResourceType), 
          amount: amount,
          card: resourceTypeToResourceCard(type as ResourceType)
        }))),
        map((resources) => resources.filter(r => r.amount > 0)),
        tap(console.log)
      )
    })
  )

  private readonly _requestInventory$ = this.offerForm.controls.requestInventory.valueChanges.pipe(
    startWith(this.offerForm.controls.requestInventory.value),
    filter((e) => e !== null)
  )

  public selectRequestedResources = this._requestInventory$.pipe(
    switchMap((inv) => {
      return inv.selectInventory().pipe(
        map((inv) => Object.entries(inv).map(([type, amount]) => ({ 
          mode: resourceTypeToActionCardMode(type as ResourceType), 
          amount: amount,
          card: resourceTypeToResourceCard(type as ResourceType)
        }))),
        map((resources) => resources.filter(r => r.amount > 0)),
        tap(console.log)
      )
    })
  )

  private readonly _offerInventory$ = this.offerForm.controls.offerInventory.valueChanges.pipe(
    startWith(this.offerForm.controls.offerInventory.value),
    filter((e) => e !== null)
  )

  //todo remove duplicates here
  public selectOfferedResources = this._offerInventory$.pipe(
    switchMap((inv) => {
      return inv.selectInventory().pipe(
        map((inv) => Object.entries(inv).map(([type, amount]) => ({ 
          mode: resourceTypeToActionCardMode(type as ResourceType), 
          amount: amount,
          card: resourceTypeToResourceCard(type as ResourceType)
        }))),
        map((resources) => resources.filter(r => r.amount > 0)),
        tap(console.log)
      )
    })
  )

  public setIsPlayerTrade(isPlayerTrade: boolean): void {
    this.offerForm.controls.isPlayerTrade.setValue(isPlayerTrade)
  }


  public addResource(type: ResourceType) {
    this.offerForm.controls.requestInventory.value?.addToInventory(type, 1);
  }

  public removeResource(type: ResourceType) {
    this.offerForm.controls.requestInventory.value?.removeFromInventory(type, 1);
  }

  public removeOfferedResource(type: ResourceType) {
    this.offerForm.controls.offerInventory.value?.removeFromInventory(type, 1);
    this.offerForm.controls.myInventory.value?.addToInventory(type, 1)
  }

  public addOfferedResource(type: ResourceType) {
    this.offerForm.controls.offerInventory.value?.addToInventory(type, 1);
    this.offerForm.controls.myInventory.value?.removeFromInventory(type, 1)
  }

  public addTrade() {
    const me = this._playerRepository.getMe();
    const offeredResources = this.offerForm.controls.offerInventory.value;
    const requestedResources = this.offerForm.controls.requestInventory.value;
    const isPlayerTrade = this.offerForm.controls.isPlayerTrade.value

    if(!me || !offeredResources || !requestedResources) return;
    this._eventQueue.publish('trade-offer-open', {
      typ: isPlayerTrade ? TradeType.Player : TradeType.Bank,
      player: me,
      offeredResources: offeredResources.resources,
      requestedResources: requestedResources.resources,
    })
  }
}
