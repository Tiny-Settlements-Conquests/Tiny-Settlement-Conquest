import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { TitleComponent } from '../../../layouts/ui/title/title.component';
import { faScaleUnbalanced } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-trade-card',
  standalone: true,
  imports: [
    CommonModule,
    BlockComponent,
    TitleComponent,
    FontAwesomeModule
  ],
  templateUrl: './trade-card.component.html',
  styleUrl: './trade-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeCardComponent { 
  public readonly icons = {
    scale: faScaleUnbalanced
  }
}
