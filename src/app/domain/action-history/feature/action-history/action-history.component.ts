import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { asapScheduler } from 'rxjs';
import { ActionCardComponent } from '../../../cards/feature/action-card/action-card.component';
import { DiceRandomNumberComponent } from '../../../dice/ui/dice-random-number/dice-random-number.component';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { ActionHistoryRepository } from '../../domain/state/action-history.repository';
import { BuildEventComponent } from '../../ui/build-event/build-event.component';
import { ActionEventComponent } from '../action-event/action-event.component';

@Component({
  selector: 'app-action-history',
  standalone: true,
  imports: [
    BlockComponent, 
    ActionCardComponent, 
    NgStyle,
    DiceRandomNumberComponent,
    BuildEventComponent,
    ActionEventComponent
  ],
  templateUrl: './action-history.component.html',
  styleUrl: './action-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionHistoryComponent{ 
  private readonly _actionHistoryRepository = inject(ActionHistoryRepository);

  public readonly actions = toSignal(
    this._actionHistoryRepository.selectAllActions()
  )

  private readonly _scrollGuard = effect(() => {
    const actions = this.actions();
    if(actions && actions.length > 0) {
      asapScheduler.schedule(() => this.scrollToBottom(), 100);
    }
  })


  @ViewChild('scrollContainer')
  private readonly scrollContainerEl: ElementRef | undefined;

  public scrollToBottom() {
    if(this.scrollContainerEl) {
      this.scrollContainerEl.nativeElement.scrollTop = this.scrollContainerEl.nativeElement.scrollHeight;
    }
  }
}
