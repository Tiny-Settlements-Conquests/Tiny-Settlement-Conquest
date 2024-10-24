import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MatDialog
} from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { AppComponent } from '../../app.component';
import { ActionHistoryRepository } from '../../domain/action-history/domain/state/action-history.repository';
import { ActionHistoryComponent } from '../../domain/action-history/feature/action-history/action-history.component';
import { BankRepository } from '../../domain/bank/domain/state/bank.repository';
import { BankComponent } from '../../domain/bank/feature/bank/bank.component';
import { BuildingsSelectionComponent } from '../../domain/buildings/feature/buildings-selection/buildings-selection.component';
import { ChatComponent } from '../../domain/chat/feature/chat/chat.component';
import { DiceRepository } from '../../domain/dice/domain/state/dice.repository';
import { DiceOverlayComponent } from '../../domain/dice/ui/dice-overlay/dice-overlay.component';
import { DiceRandomNumberComponent } from '../../domain/dice/ui/dice-random-number/dice-random-number.component';
import { Game } from '../../domain/game/domain/classes/game';
import { GameLocalClient } from '../../domain/game/domain/classes/game-local-client';
import { GameModeRepository } from '../../domain/game/domain/state/game-mode.repository';
import { CanvasComponent } from '../../domain/game/feature/canvas/canvas.component';
import { BuildingOptionsInventoryComponent } from '../../domain/info/feature/building-options-inventory/building-options-inventory.component';
import { GameInformationBarComponent } from '../../domain/info/feature/game-information-bar/game-information-bar.component';
import { InventoryRepository } from '../../domain/inventory/domain/state/inventory.repository';
import { ResourceInventoryComponent } from '../../domain/inventory/feature/resource-inventory/resource-inventory.component';
import { BlockComponent } from '../../domain/layouts/ui/block/block.component';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { PlayerCardComponent } from '../../domain/player/feature/players-card/player-card.component';
import { ResponseQueueRepository } from '../../domain/response-queue/domain/state/response-queue.repository';
import { RoundPlayerRepository } from '../../domain/round/domain/state/round-players.repository';
import { NextMoveButtonComponent } from '../../domain/round/feature/next-move-button/next-move-button.component';
import { RoundPlayerCardsComponent } from '../../domain/round/feature/round-player-cards/round-player-cards.component';
import { TradeRepository } from '../../domain/trade/domain/state/trade.repository';
import { TradeButtonComponent } from '../../domain/trade/feature/trade-button/trade-button.component';
import { TradeDialogComponent } from '../../domain/trade/feature/trade-dialog/trade-dialog.component';
import { TradeMenuComponent } from '../../domain/trade/feature/trade-menu/trade-menu.component';
import { TradeRequestComponent } from '../../domain/trade/feature/trade-request/trade-request.component';
import { UserRepository } from '../../domain/user/domain/state/user.repository';
import { tap } from 'rxjs';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CanvasComponent,
    TitleComponent,
    BlockComponent,
    BuildingsSelectionComponent,
    PlayerCardComponent,
    FontAwesomeModule,
    RoundPlayerCardsComponent,
    ResourceInventoryComponent,
    NextMoveButtonComponent,
    ActionHistoryComponent,
    ChatComponent,
    BankComponent,
    DiceRandomNumberComponent,
    DiceOverlayComponent,
    TradeMenuComponent,
    GameInformationBarComponent,
    BuildingOptionsInventoryComponent,
    TradeButtonComponent,
    TradeRequestComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent { 
  private readonly _gameModeRepository = inject(GameModeRepository);
  private readonly _userRepository = inject(UserRepository);
  private readonly _roundPlayerRepository = inject(RoundPlayerRepository);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _app = inject(AppComponent);
  private readonly _inventoryRepository = inject(InventoryRepository);
  private readonly _bankRepository = inject(BankRepository);
  private readonly _diceRepository = inject(DiceRepository);
  private readonly _actionHistoryRepository = inject(ActionHistoryRepository);
  private readonly _tradeRepository = inject(TradeRepository);
  private readonly _responseQueueRepository = inject(ResponseQueueRepository);
  readonly dialog = inject(MatDialog);
  //todo das overlay nochmal umbauen, sodass es einfach nur über dem canvas liegt
  public icons = {
    clock: faClock
  }

  public readonly isMyTurn = toSignal(
    this._roundPlayerRepository.selectIsMyTurn()
  )

  private readonly _game = signal<Game | undefined>(undefined)

  public get game() {
    return this._game();
  }

  public readonly me = toSignal(
    this._roundPlayerRepository.selectMe()
  )

  public readonly selectTradeRequests = toSignal(
    this._tradeRepository.selectAllTrades().pipe(
      tap((d) => console.log("ALL TRAAAAADES", d))
    )
  );
  public readonly roundPlayers = toSignal(
    this._roundPlayerRepository.selectRoundPlayers()
  )

  openDialog(): void {
   this.dialog.open(TradeDialogComponent);
  }

  public ngOnInit() {
    const client = new GameLocalClient(
      this._app._ref,
      this._bankRepository,
      this._inventoryRepository,
      this._roundPlayerRepository,
      this._userRepository,
      this._gameModeRepository,
      this._diceRepository,
      this._actionHistoryRepository,
      this._tradeRepository,
      this._responseQueueRepository,
      this._destroyRef
    );
    this._game.set(client.game)
  }
  
}
