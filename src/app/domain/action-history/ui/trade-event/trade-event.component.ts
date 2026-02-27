import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TradeAction } from '@catan/shared/models';

@Component({
  selector: 'app-trade-event',
  standalone: true,
  templateUrl: './trade-event.component.html',
  styleUrl: './trade-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeEventComponent { 
  public readonly action = input.required<TradeAction>()
}
