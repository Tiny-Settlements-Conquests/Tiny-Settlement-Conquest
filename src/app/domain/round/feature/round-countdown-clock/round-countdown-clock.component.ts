import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TimePipe } from '../../../time/domain/pipes/time.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RoundCountdownStore } from '../../domain/state/countdown/round-countdown.store';

@Component({
    selector: 'app-round-countdown-clock',
    imports: [
        TimePipe,
        FaIconComponent
    ],
    templateUrl: './round-countdown-clock.component.html',
    styleUrl: './round-countdown-clock.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundCountdownClockComponent { 
  private readonly _roundCountdownRepository = inject(RoundCountdownStore);
  public readonly countdown = this._roundCountdownRepository.countdownInMS

  public readonly icons = {
    clock: faClock
  }
}
