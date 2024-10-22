import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAdd, faCheck, faClose, faHourglass } from '@fortawesome/free-solid-svg-icons';
import { dispatch } from '@ngneat/effects';
import { RoundPlayer } from '../../../round/domain/models/round-player.model';
import { OpenTradeOffer } from '../../domain/models/trade.model';
import { TradeActions } from '../../domain/state/trade.actions';

@Component({
  selector: 'app-trade-request',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './trade-request.component.html',
  styleUrl: './trade-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeRequestComponent {
  public readonly tradeOffer = input.required<OpenTradeOffer>();
  public readonly roundPlayers = input.required<RoundPlayer[]>();
  public readonly me = input.required<RoundPlayer>();
  public readonly icons = {
    add: faCheck,
    close: faClose,
    hourGlass: faHourglass
  }

  public readonly roundPlayersWithoutHost = computed(() => {
    const hostId = this.tradeOffer().player.id
    return this.roundPlayers().filter((player) => player.id !== hostId)
  })

  public getStatusIcon(player: RoundPlayer) {
    const offer = this.tradeOffer();
    const playerResponse = offer.playerResponses[player.id];
    if(!playerResponse) return this.icons.hourGlass;
    return playerResponse.accepted ? this.icons.add : this.icons.close
  }

  public acceptTrade() {
    dispatch(
      TradeActions.acceptTrade({
        accepted: true,
        respondedPlayer: this.me(),
        tradeId: this.tradeOffer().id
      })
    )
  }

  public denyTrade() {
    dispatch(
      TradeActions.denyTrade({
        accepted: false,
        respondedPlayer: this.me(),
        tradeId: this.tradeOffer().id
      })
    )
  }
}
