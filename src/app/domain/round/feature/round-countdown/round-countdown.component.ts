import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TimePipe } from '../../../time/domain/pipes/time.pipe';
import { RoundCountdownRepository } from '../../domain/state/countdown/round-countdown.repository';

/**
 * @deprecated
 * todo remove this component and replace by round-countdown-clock.component.ts
 */
@Component({
  selector: 'app-round-countdown',
  standalone: true,
  imports: [
    TimePipe
  ],
  host: {
    class: 'gradient-background-blue'
  },
  templateUrl: './round-countdown.component.html',
  styleUrl: './round-countdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundCountdownComponent { 
  private readonly _roundCountdownRepository = inject(RoundCountdownRepository);
  public readonly countdown = toSignal(
    this._roundCountdownRepository.selectCountdownMiliseconds()
  )

}
