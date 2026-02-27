import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TimePipe } from '../../../time/domain/pipes/time.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { GameFacade } from '@catan/feature-game';

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
  private readonly _facade = inject(GameFacade);
  public readonly countdown = this._facade.countdown;

  public readonly icons = {
    clock: faClock
  }
}
