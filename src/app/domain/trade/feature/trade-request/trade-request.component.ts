import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCheck, faCircleDown, faCircleUp, faClose, faHourglass } from '@fortawesome/free-solid-svg-icons';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';
import { GameSetupService } from '../../../game/domain/services/game-setup.service';
import { resourceTypeToResourceCard } from '../../../resources/domain/function/resource-type.function';
import { Resources, ResourceType } from '../../../resources/domain/models/resources.model';
import { excludeEmptyResources } from '../../../resources/domain/utils/resource.utils';
import { RoundPlayer } from '../../../round/domain/models/round-player.model';
import { PlayerTrade } from '../../domain/models/trade.model';
import { TradeStore } from '../../domain/state/trade.store';

@Component({
    selector: 'app-trade-request',
    imports: [
        FaIconComponent,
        ActionCardStackComponent,
        MatTooltip
    ],
    templateUrl: './trade-request.component.html',
    styleUrl: './trade-request.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeRequestComponent {
  private readonly gameSetupService = inject(GameSetupService);

  public readonly tradeOffer = input.required<PlayerTrade>();
  public readonly roundPlayers = input.required<RoundPlayer[]>();
  public readonly me = input.required<RoundPlayer>();
  public readonly icons = {
    add: faCheck,
    close: faClose,
    hourGlass: faHourglass,
    up: faCircleUp,
    down: faCircleDown,
  }

  private readonly _tradeStore = inject(TradeStore);


  public readonly roundPlayersWithoutHost = computed(() => {
    const hostId = this.tradeOffer().player.id
    return this.roundPlayers().filter((player) => player.id !== hostId)
  })

  public readonly requestedResources = computed(() => {
    return this.resourcesToActionCardIterable(
      excludeEmptyResources(this.tradeOffer().requestedResources)
    )
  })

  public readonly offeredResources = computed(() => {
    return this.resourcesToActionCardIterable(
      excludeEmptyResources(this.tradeOffer().offeredResources)
    )
  })

  public getStatusIcon(player: RoundPlayer) {
    const offer = this.tradeOffer();
    const playerResponse = offer.playerResponses[player.id];
    if(!playerResponse) return this.icons.hourGlass;
    return playerResponse.accepted ? this.icons.add : this.icons.close
  }

  public acceptTrade() {
    this.gameSetupService.eventGateway?.respondToTrade({
      accepted: true,
      respondedPlayer: this.me(),
      tradeId: this.tradeOffer().id
    })
  }

  public denyTrade() {
    this.gameSetupService.eventGateway?.respondToTrade({
      accepted: false,
      respondedPlayer: this.me(),
      tradeId: this.tradeOffer().id
    })
  }

  private resourcesToActionCardIterable(resources: Partial<Resources>) {
    return Object.entries(resources).map(([name, count]) => ({
      card: resourceTypeToResourceCard(<ResourceType>name), count}
    ))
  }
}
