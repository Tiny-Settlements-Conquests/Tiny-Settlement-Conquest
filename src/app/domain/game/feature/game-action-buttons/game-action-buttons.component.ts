import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { RoundPlayerStore } from '../../../round/domain/state/round-player.store';
import { NextMoveButtonComponent } from '../../../round/feature/next-move-button/next-move-button.component';
import { TradeButtonComponent } from '../../../trade/feature/trade-button/trade-button.component';
import { TradeDialogComponent } from '../../../trade/feature/trade-dialog/trade-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BankButtonComponent } from '../../../bank/feature/bank-button/bank-button.component';

@Component({
  selector: 'app-game-action-buttons',
  imports: [
      TradeButtonComponent,
      NextMoveButtonComponent,
      BankButtonComponent
  ],
  templateUrl: './game-action-buttons.component.html',
  styleUrl: './game-action-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameActionButtonsComponent { 
  private readonly _roundPlayerStore = inject(RoundPlayerStore);
  private readonly dialog = inject(MatDialog);
  private readonly _injector = inject(Injector);

  public readonly isMyTurn = this._roundPlayerStore.isMyTurn;

  openDialog(): void {
    this.dialog.open(TradeDialogComponent, {
      injector: this._injector,
    });
  }
}
