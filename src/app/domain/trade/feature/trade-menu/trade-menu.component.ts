import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleDown, faCircleUp, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { resourceTypes } from '../../../resources/domain/models/resources.model';
import { ResourceCardComponent } from '../../../resources/ui/resource-card/resource-card.component';

import { TradeOfferService } from '../../domain/services/trade-offer.service';

@Component({
  selector: 'app-trade-menu',
  standalone: true,
  imports: [
    BlockComponent,
    ResourceCardComponent,
    FontAwesomeModule,
    ActionCardStackComponent
  ],
  templateUrl: './trade-menu.component.html',
  styleUrl: './trade-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeMenuComponent implements OnInit{ 
  public readonly _tradeOfferService = inject(TradeOfferService);

  public readonly isPlayerTrade = toSignal(
    this._tradeOfferService.selectIsPlayerTrade()
  )
  

  public readonly resourceTypes = resourceTypes;
  public readonly icons = {
    up: faCircleUp,
    down: faCircleDown,
    user: faUser,
    close: faXmark
  }

  public resources = toSignal(this._tradeOfferService.selectMyInventoryResources)

  public requestedResources = toSignal(
    this._tradeOfferService.selectRequestedResources
  )

  public offeredResources = toSignal(
    this._tradeOfferService.selectOfferedResources
  )

  public ngOnInit(): void {
    this._tradeOfferService.syncMyInventory()
  }

  public cancelTrade() {

  }


}
