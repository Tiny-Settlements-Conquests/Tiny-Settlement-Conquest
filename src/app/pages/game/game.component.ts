import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  MatDialog
} from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { ActionHistoryComponent } from '../../domain/action-history/feature/action-history/action-history.component';
import { DiceOverlayComponent } from '../../domain/dice/ui/dice-overlay/dice-overlay.component';
import { GameEventDispatcherService } from '../../domain/event-dispatcher/game-event-dispatcher.service';
import { EVENT_GATEWAY_TOKEN } from '@catan/core';
import { Game } from '@catan/game-engine';
import { GAME_STATE } from '@catan/shared/models';
import { provideGameClientEditionService } from '../../domain/game/domain/providers/game-client-edition-service.provider';
import { provideGameEventStores } from '../../domain/game/domain/providers/game-event-stores.provider';
import { GameInitializerService } from '../../domain/game/domain/services/game-initializer.service';
import { GameFacade } from '@catan/feature-game';
import { GAME_CLIENT_EDITION_SERVICE_TOKEN } from '../../domain/game/domain/tokens/game-client-edition-service.token';
import { CanvasComponent } from '../../domain/game/feature/canvas/canvas.component';
import { GameActionButtonsComponent } from '../../domain/game/feature/game-action-buttons/game-action-buttons.component';
import { BuildingOptionsInventoryComponent } from '../../domain/info/feature/building-options-inventory/building-options-inventory.component';
import { GameInformationBarComponent } from '../../domain/info/feature/game-information-bar/game-information-bar.component';
import { TradeRequestComponent } from '../../domain/trade/feature/trade-request/trade-request.component';
import { PauseOverlayComponent } from '../../domain/pause/feature/pause-overlay/pause-overlay.component';


@Component({
    selector: 'app-game',
    imports: [
        CanvasComponent,
        FontAwesomeModule,
        ActionHistoryComponent,
        GameInformationBarComponent,
        BuildingOptionsInventoryComponent,
        GameActionButtonsComponent,
        TradeRequestComponent,
        DiceOverlayComponent,
        PauseOverlayComponent,
    ],
    templateUrl: './game.component.html',
    styleUrl: './game.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
      GameEventDispatcherService,
      provideGameEventStores(),
      provideGameClientEditionService(),
      GameInitializerService,
      {
        provide: EVENT_GATEWAY_TOKEN,
        useFactory: (init: GameInitializerService) => init.initializeGame().gateway,
        deps: [GameInitializerService],
      },
      GameFacade,
    ]
})
export class GameComponent { 
  private readonly _facade = inject(GameFacade);
  private readonly _gameModeServiceLoader = inject(GAME_CLIENT_EDITION_SERVICE_TOKEN) // do not remove
  readonly dialog = inject(MatDialog);
  private readonly _initializer = inject(GameInitializerService);
  public readonly eventDispatcher = inject(GameEventDispatcherService);
  
  public icons = {
    clock: faClock
  }
  

  private readonly _game = signal<Game | undefined>(undefined)
  public readonly playground = computed(() => {
    return this._game()?.playground;
  })

  public readonly me = this._facade.me;
  public readonly isDiceOverlayOpen = this._facade.isDiceOverlayOpen;
  public readonly isPaused = computed(() => this._facade.gameState() === GAME_STATE.PAUSE);

  //todo move to own component
  public readonly selectTradeRequests = this._facade.trades;
  public readonly roundPlayers = this._facade.roundPlayers;



  public ngOnInit() {
    const { game } = this._initializer.initializeGame();
    this._game.set(game);
    this.eventDispatcher.sync(game);
  }
}
