import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faForward } from '@fortawesome/free-solid-svg-icons';
import { dispatch } from '@ngneat/effects';
import { EventQueueActions } from '../../../event-queues/domain/state/event-queue/event-queue.actions';

@Component({
    selector: 'app-next-move-button',
    imports: [
        FontAwesomeModule,
    ],
    templateUrl: './next-move-button.component.html',
    styleUrl: './next-move-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NextMoveButtonComponent { 
  public icons = {
    next: faForward
  }

  @HostListener('click')
  public endMove() {
    dispatch(
      EventQueueActions.publish({
        eventType: 'nextRound',
        data: null
      })
    )
  }
}
