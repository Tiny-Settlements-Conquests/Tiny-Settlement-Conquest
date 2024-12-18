import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
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
import { DiceRepository } from '../../domain/dice/domain/state/dice.repository';
import { Game } from '../../domain/game/domain/classes/game';
import { GameLocalClient } from '../../domain/game/domain/classes/game-local-client';
import { GameSetupService } from '../../domain/game/domain/services/game-setup.service';
import { GameModeRepository } from '../../domain/game/domain/state/game-mode.repository';
import { CanvasComponent } from '../../domain/game/feature/canvas/canvas.component';
import { BuildingOptionsInventoryComponent } from '../../domain/info/feature/building-options-inventory/building-options-inventory.component';
import { GameInformationBarComponent } from '../../domain/info/feature/game-information-bar/game-information-bar.component';
import { InventoryRepository } from '../../domain/inventory/domain/state/inventory.repository';
import { LobbyRepository } from '../../domain/lobby/domain/state/repository';
import { EventQueueRepository } from '../../domain/response-queue/domain/state/event-queue.repository';
import { RoundPlayerRepository } from '../../domain/round/domain/state/round-players.repository';
import { NextMoveButtonComponent } from '../../domain/round/feature/next-move-button/next-move-button.component';
import { TradeRepository } from '../../domain/trade/domain/state/trade.repository';
import { TradeButtonComponent } from '../../domain/trade/feature/trade-button/trade-button.component';
import { TradeDialogComponent } from '../../domain/trade/feature/trade-dialog/trade-dialog.component';
import { TradeRequestComponent } from '../../domain/trade/feature/trade-request/trade-request.component';
import { UserRepository } from '../../domain/user/domain/state/user.repository';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CanvasComponent,
    FontAwesomeModule,
    NextMoveButtonComponent,
    ActionHistoryComponent,
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
  private readonly _eventQueueRepository = inject(EventQueueRepository);
  readonly dialog = inject(MatDialog);
  private readonly _lobbyRepository = inject(LobbyRepository);
  private readonly _gameSetupService = inject(GameSetupService);
  public icons = {
    clock: faClock
  }

  public readonly isMyTurn = toSignal(
    this._roundPlayerRepository.selectIsMyTurn()
  )

  private readonly _game = signal<Game | undefined>(undefined)
  public readonly playground = computed(() => {
    return this._game()?.playground;
  })

  public readonly me = toSignal(
    this._roundPlayerRepository.selectMe()
  )

  public readonly selectTradeRequests = toSignal(
    this._tradeRepository.selectAllTrades()
  );
  public readonly roundPlayers = toSignal(
    this._roundPlayerRepository.selectRoundPlayers()
  )

  openDialog(): void {
   this.dialog.open(TradeDialogComponent);
  }

  public ngOnInit() {
    const game = this._gameSetupService.loadGame();
    
    const client = new GameLocalClient({
        gameComponentRef: this._app._ref,
        bankRepository: this._bankRepository,
        inventoryRepository: this._inventoryRepository,
        roundPlayerRepository: this._roundPlayerRepository,
        userRepository: this._userRepository,
        gameModeRepository: this._gameModeRepository,
        diceRepository: this._diceRepository,
        actionHistoryRepository: this._actionHistoryRepository,
        tradeRepository: this._tradeRepository,
        eventQueueRepository: this._eventQueueRepository,
        destroyRef: this._destroyRef,
      }, 
      game
    );
    this._game.set(client.game)
  }
}
