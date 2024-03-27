import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CanvasComponent } from '../../domain/game/feature/canvas/canvas.component';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { BlockComponent } from '../../domain/layouts/ui/block/block.component';
import { BuildingsSelectionComponent } from '../../domain/buildings/feature/buildings-selection/buildings-selection.component';
import { TradeCardComponent } from '../../domain/trade/feature/trade-card/trade-card.component';
import { PlayerCardComponent } from '../../domain/player/feature/players-card/player-card.component';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RoundPlayerCardsComponent } from '../../domain/round/feature/round-player-cards/round-player-cards.component';
import { ResourceInventoryComponent } from '../../domain/inventory/feature/resource-inventory/resource-inventory.component';
import { NextMoveButtonComponent } from '../../domain/round/feature/next-move-button/next-move-button.component';
import { ActionHistoryComponent } from '../../domain/action-history/feature/action-history/action-history.component';
import { ChatComponent } from '../../domain/chat/feature/chat/chat.component';
import { BankComponent } from '../../domain/bank/feature/bank/bank.component';
import { DiceRandomNumberComponent } from '../../domain/dice/feature/dice-random-number/dice-random-number.component';



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
    DiceRandomNumberComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent { 
  //todo das overlay nochmal umbauen, sodass es einfach nur über dem canvas liegt
  public icons = {
    clock: faClock
  }
}
