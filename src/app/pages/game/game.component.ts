import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MatDialog
} from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { ActionHistoryComponent } from '../../domain/action-history/feature/action-history/action-history.component';
import { DiceSyncService } from '../../domain/dice/domain/services/dice-sync.service';
import { provideEventGateway } from '../../domain/event-queues/domain/providers/event-gateway.provider';
import { GameEventDispatcherService } from '../../domain/event-queues/services/game-event-dispatcher.service';
import { Game } from '../../domain/game/domain/classes/game';
import { provideGameClientEditionService } from '../../domain/game/domain/providers/game-client-edition-service.provider';
import { provideGameComponentRef } from '../../domain/game/domain/providers/game-component-ref.provider';
import { provideGameEventStores } from '../../domain/game/domain/providers/game-event-stores.provider';
import { GameSetupService } from '../../domain/game/domain/services/game-setup.service';
import { GAME_CLIENT_EDITION_SERVICE_TOKEN } from '../../domain/game/domain/tokens/game-client-edition-service.token';
import { CanvasComponent } from '../../domain/game/feature/canvas/canvas.component';
import { BuildingOptionsInventoryComponent } from '../../domain/info/feature/building-options-inventory/building-options-inventory.component';
import { GameInformationBarComponent } from '../../domain/info/feature/game-information-bar/game-information-bar.component';
import { RoundPlayerStore } from '../../domain/round/domain/state/round-player.store';
import { NextMoveButtonComponent } from '../../domain/round/feature/next-move-button/next-move-button.component';
import { TradeRepository } from '../../domain/trade/domain/state/trade.repository';
import { TradeButtonComponent } from '../../domain/trade/feature/trade-button/trade-button.component';
import { TradeDialogComponent } from '../../domain/trade/feature/trade-dialog/trade-dialog.component';
import { TradeRequestComponent } from '../../domain/trade/feature/trade-request/trade-request.component';


@Component({
    selector: 'app-game',
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
    providers: [
      provideGameComponentRef(),
      GameEventDispatcherService,
      provideGameEventStores(),
      provideEventGateway(),
      provideGameClientEditionService(),
      DiceSyncService,
    ]
})
export class GameComponent { 
  private readonly _roundPlayerStore = inject(RoundPlayerStore);
  private readonly _tradeRepository = inject(TradeRepository);
  private readonly _gameModeServiceLoader = inject(GAME_CLIENT_EDITION_SERVICE_TOKEN) // do not remove
  readonly dialog = inject(MatDialog);
  private readonly _gameSetupService = inject(GameSetupService);
  public readonly eventDispatcher = inject(GameEventDispatcherService);
  private readonly _diceSyncService = inject(DiceSyncService); // do not remove
  
  public icons = {
    clock: faClock
  }
  
  public readonly isMyTurn = this._roundPlayerStore.isMyTurn;

  private readonly _game = signal<Game | undefined>(undefined)
  public readonly playground = computed(() => {
    return this._game()?.playground;
  })

  public readonly me = this._roundPlayerStore.me;

  //todo move to own component
  public readonly selectTradeRequests = toSignal(
    this._tradeRepository.selectAllTrades()
  );
  public readonly roundPlayers = this._roundPlayerStore.entities;

  openDialog(): void {
   this.dialog.open(TradeDialogComponent);
  }

  public ngOnInit() {
    const game = this._gameSetupService.loadGame();

    this._game.set(game);
    this.eventDispatcher.sync(game)
  }
}
