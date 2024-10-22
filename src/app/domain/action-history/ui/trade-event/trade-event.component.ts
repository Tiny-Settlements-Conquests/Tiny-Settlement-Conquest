import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TradeAction } from '../../domain/models/action.model';

@Component({
  selector: 'app-trade-event',
  standalone: true,
  imports: [
  ],
  templateUrl: './trade-event.component.html',
  styleUrl: './trade-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeEventComponent { 
  public readonly action = input.required<TradeAction>()

}
