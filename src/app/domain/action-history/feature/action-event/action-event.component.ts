import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HistoryAction } from '../../domain/models/action.model';
import { BuildEventComponent } from '../../ui/build-event/build-event.component';
import { DiceEventComponent } from "../../ui/dice-event/dice-event.component";
import { TradeEventComponent } from '../../ui/trade-event/trade-event.component';
import { ResourceEventComponent } from '../../ui/resource-event/resource-event.component';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-action-event',
    imports: [
        BuildEventComponent,
        DiceEventComponent,
        TradeEventComponent,
        ResourceEventComponent,
        NgStyle
    ],
    templateUrl: './action-event.component.html',
    styleUrl: './action-event.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionEventComponent {
  public readonly historyAction = input.required<HistoryAction>();
  
  public readonly isFollowUp = input.required<boolean>();
}
