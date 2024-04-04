import { ChangeDetectionStrategy, Component, DestroyRef, ViewContainerRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { ActionHistoryComponent } from '../../domain/action-history/feature/action-history/action-history.component';
import { BankComponent } from '../../domain/bank/feature/bank/bank.component';
import { BuildCostManager } from '../../domain/buildings/domain/classes/build-cost-manager';
import { BuildingBuildManager } from '../../domain/buildings/domain/classes/building-build-manager';
import { RoadBuildManager } from '../../domain/buildings/domain/classes/road-build-manager';
import { GraphBuildingNode } from '../../domain/buildings/domain/graph/graph-building-node';
import { BuildingsSelectionComponent } from '../../domain/buildings/feature/buildings-selection/buildings-selection.component';
import { ChatComponent } from '../../domain/chat/feature/chat/chat.component';
import { DiceOverlayComponent } from '../../domain/dice/ui/dice-overlay/dice-overlay.component';
import { DiceRandomNumberComponent } from '../../domain/dice/ui/dice-random-number/dice-random-number.component';
import { Game } from '../../domain/game/domain/classes/game';
import { GameModeRepository } from '../../domain/game/domain/state/game-mode.repository';
import { CanvasComponent } from '../../domain/game/feature/canvas/canvas.component';
import { Graph } from '../../domain/graph/domain/classes/graph';
import { Inventory } from '../../domain/inventory/domain/classes/inventory';
import { InventoryRepository } from '../../domain/inventory/domain/state/inventory.repository';
import { ResourceInventoryComponent } from '../../domain/inventory/feature/resource-inventory/resource-inventory.component';
import { BlockComponent } from '../../domain/layouts/ui/block/block.component';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { Player } from '../../domain/player/domain/classes/player';
import { PlayerCardComponent } from '../../domain/player/feature/players-card/player-card.component';
import { PlaygroundGenerator } from '../../domain/playground/domain/generators/playground-generator';
import { PlaygroundGraphGenerator } from '../../domain/playground/domain/generators/playground-graph-generator';
import { PlaygroundGridGenerator } from '../../domain/playground/domain/generators/playground-grid-generator';
import { ResourceGenerator } from '../../domain/resources/classes/generators/resource-generator';
import { Round } from '../../domain/round/domain/classes/round';
import { RoundPlayerRepository } from '../../domain/round/domain/state/round-players.repository';
import { NextMoveButtonComponent } from '../../domain/round/feature/next-move-button/next-move-button.component';
import { RoundPlayerCardsComponent } from '../../domain/round/feature/round-player-cards/round-player-cards.component';
import { TradeCardComponent } from '../../domain/trade/feature/trade-card/trade-card.component';
import { UserRepository } from '../../domain/user/domain/state/user.repository';
import { BankRepository } from '../../domain/bank/domain/state/bank.repository';
import { Playground } from '../../domain/playground/domain/classes/playground';
import { GameLocalClient } from '../../domain/game/domain/classes/game-local-client';



@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CanvasComponent,
    TitleComponent,
    BlockComponent,
    BuildingsSelectionComponent,
    TradeCardComponent,
    PlayerCardComponent,
    FontAwesomeModule,
    RoundPlayerCardsComponent,
    ResourceInventoryComponent,
    NextMoveButtonComponent,
    ActionHistoryComponent,
    ChatComponent,
    BankComponent,
    DiceRandomNumberComponent,
    DiceOverlayComponent
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
  private readonly _ref = inject(ViewContainerRef);
  private readonly _inventoryRepository = inject(InventoryRepository);
  private readonly _bankRepository = inject(BankRepository)

  //todo das overlay nochmal umbauen, sodass es einfach nur über dem canvas liegt
  public icons = {
    clock: faClock
  }

  private readonly _game = signal<Game | undefined>(undefined)

  public get game() {
    return this._game();
  }

  public ngOnInit() {
    
    const client = new GameLocalClient(
      this._ref,
      this._bankRepository,
      this._inventoryRepository,
      this._roundPlayerRepository,
      this._userRepository,
      this._gameModeRepository,
      this._destroyRef
    );
    this._game.set(client.game)
    
    // this._game.set(game);

    // this._gameModeRepository.selectMode().pipe(
    //   takeUntilDestroyed(this._destroyRef)
    // ).subscribe((mode) => {
    //   if(this.game === undefined) return;

    //   this.game.mode = mode;
    // })

    // this._roundPlayerREpository.selectActiveRoundPlayer().subscribe((roundPlayer) => {
    //   if(!roundPlayer) return;
    //   // this.openDiceOverlay();
    //   this._gameModeRepository.updateMode('spectate');
    //   console.log("update")
    //   round.setActivePlayerById(roundPlayer.id);
    // })
    

    // const me = this._userRepository.getUser();
    // if(!me) return;
    // this.openDiceOverlay().subscribe((result) => {
    //   console.log("RESULT", result);
    //   this.game?.rolledDice(result);
    // })
    // const roundPlayer = this.game?.round.players.find((u) => u.id === me.id);
    // if(!roundPlayer) return;
    // console.log(roundPlayer?.inventory.resources)
    // roundPlayer.inventory.selectResources().subscribe((resources) => {
    //   console.log("ja schon aber warum denkst du das denn?")
    //   this._inventoryRepository.setResources(resources)
    // })

    // this.game?.bank.selectResources().subscribe((resources) => {
    //   console.log("RRR",resources);
    //   this._bankRepository.setInventory(resources)
    // })

    // this._inventoryRepository.updateResourceAmount()
  }

  

  

  

  
}
