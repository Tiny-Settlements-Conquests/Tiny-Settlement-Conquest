import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { asapScheduler } from 'rxjs';
import { ActionEventComponent } from '../action-event/action-event.component';
import { ActionHistoryStore } from '../../domain/state/action-history.store';
import { HistoryAction } from '../../domain/models/action.model';

@Component({
    selector: 'app-action-history',
    imports: [
        ActionEventComponent
    ],
    templateUrl: './action-history.component.html',
    styleUrl: './action-history.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionHistoryComponent{ 
  private readonly _actionHistoryStore = inject(ActionHistoryStore);

  public readonly actions = this._actionHistoryStore.entities;

  public readonly _scrollGuard = effect(() => {
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

  public isFollowUp(index: number, currentAction: HistoryAction): boolean {
    const _actions = this.actions();
    return _actions[index - 1]?.player?.id === currentAction.player.id;
    

  }
}
