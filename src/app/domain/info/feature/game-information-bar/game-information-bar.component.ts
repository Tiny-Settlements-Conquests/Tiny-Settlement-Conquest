import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RoundCountdownClockComponent } from '../../../round/feature/round-countdown-clock/round-countdown-clock.component';
import { RoundPlayerCardsComponent } from '../../../round/feature/round-player-cards/round-player-cards.component';

@Component({
    selector: 'app-game-information-bar',
    imports: [
        RoundCountdownClockComponent,
        RoundPlayerCardsComponent
    ],
    templateUrl: './game-information-bar.component.html',
    styleUrl: './game-information-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameInformationBarComponent { }
