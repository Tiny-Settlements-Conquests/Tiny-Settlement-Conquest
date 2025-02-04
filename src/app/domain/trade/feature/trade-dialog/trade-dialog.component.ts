import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { dispatch } from '@ngneat/effects';
import { RoundPlayerRepository } from '../../../round/domain/state/round-players.repository';
import { TradeOfferService } from '../../domain/services/trade-offer.service';
import { TradeRepository } from '../../domain/state/trade.repository';
import { TradeMenuComponent } from '../trade-menu/trade-menu.component';

@Component({
    selector: 'app-trade-dialog',
    imports: [
        MatDialogContent,
        MatDialogActions,
        MatDialogTitle,
        TradeMenuComponent,
        FaIconComponent,
        MatDialogClose,
        NgClass
    ],
    templateUrl: './trade-dialog.component.html',
    styleUrl: './trade-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TradeRepository]
})
export class TradeDialogComponent {
  private readonly _matDialogRef = inject(MatDialogRef)
  private readonly _playerRepository = inject(RoundPlayerRepository); 
  public readonly _tradeOfferService = inject(TradeOfferService);

  public readonly icons = {
    user: faUser,
    close: faXmark
  }

  public players = toSignal(
    this._playerRepository.selectRoundPlayersExceptMe()
  )

  public readonly isPlayerTrade = toSignal(
    this._tradeOfferService.selectIsPlayerTrade()
  )

  public readonly isFormValid = toSignal(
    this._tradeOfferService.selectIsFormValid
  )

  public startTrade() {
    this._tradeOfferService.addTrade();
    this._matDialogRef.close();
  }
}
