import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CanvasComponent } from '../../domain/game/feature/canvas/canvas.component';
import { TitleComponent } from '../../domain/layouts/ui/title/title.component';
import { BlockComponent } from '../../domain/layouts/ui/block/block.component';
import { BuildingsSelectionComponent } from '../../domain/buildings/feature/buildings-selection/buildings-selection.component';
import { TradeCardComponent } from '../../domain/trade/feature/trade-card/trade-card.component';
import { ResourceCardsComponent } from '../../domain/resources/feature/resource-cards/resource-cards.component';
import { PlayersCardsComponent } from '../../domain/player/feature/players-cards/players-cards.component';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CanvasComponent,
    TitleComponent,
    BlockComponent,
    BuildingsSelectionComponent,
    TradeCardComponent,
    ResourceCardsComponent,
    PlayersCardsComponent,
    FontAwesomeModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent { 
  public icons = {
    clock: faClock
  }
}
