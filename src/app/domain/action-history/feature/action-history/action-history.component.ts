import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { asapScheduler } from 'rxjs';
import { ActionHistoryRepository } from '../../domain/state/action-history.repository';
import { ActionEventComponent } from '../action-event/action-event.component';

@Component({
  selector: 'app-action-history',
  standalone: true,
  imports: [
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
